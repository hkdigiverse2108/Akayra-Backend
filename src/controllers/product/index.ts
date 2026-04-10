import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination, resolveSortAndFilter } from "../../common";
import { productModel, reviewModel, categoryModel, brandModel } from "../../database";
import { aggregateData, countData, createData, deleteData, findOneAndPopulate, getData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addProductSchema, editProductSchema, deleteProductSchema, getProductsSchema, getProductByIdSchema } from "../../validation";

export const add_product = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = addProductSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    // Validate ObjectIds before creation
    if (value.categoryId) value.categoryId = isValidObjectId(value.categoryId);
    if (value.brandId) value.brandId = isValidObjectId(value.brandId);
    if (value.sizeIds) value.sizeIds = value.sizeIds.map((id) => isValidObjectId(id)).filter((id) => id !== null);
    if (value.colorIds) value.colorIds = value.colorIds.map((id) => isValidObjectId(id)).filter((id) => id !== null);

    // Auto-calculate discount and netProfit
    value.discount = (value.mrp || 0) - (value.sellingPrice || 0);
    if (value.cogsPrice) value.netProfit = (value.sellingPrice || 0) - value.cogsPrice;

    const response = await createData(productModel, value);
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess("Product"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const edit_product_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = editProductSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const productId = isValidObjectId(value.productId);
    if (!productId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Product ID", {}, {}));

    // Validate other ObjectIds if they are being updated
    if (value.categoryId) value.categoryId = isValidObjectId(value.categoryId);
    if (value.brandId) value.brandId = isValidObjectId(value.brandId);
    if (value.sizeIds) value.sizeIds = value.sizeIds.map((id) => isValidObjectId(id)).filter((id) => id !== false);
    if (value.colorIds) value.colorIds = value.colorIds.map((id) => isValidObjectId(id)).filter((id) => id !== false);

    // Auto-recalculate if prices change
    if (value.mrp !== undefined || value.sellingPrice !== undefined || value.cogsPrice !== undefined) {
      const product = await getFirstMatch(productModel, { _id: productId }, {}, {});
      if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Product"), {}, {}));

      const mrp = value.mrp !== undefined ? value.mrp : product.mrp;
      const sellingPrice = value.sellingPrice !== undefined ? value.sellingPrice : product.sellingPrice;
      const cogsPrice = value.cogsPrice !== undefined ? value.cogsPrice : product.cogsPrice;

      value.discount = mrp - sellingPrice;
      if (sellingPrice !== undefined && cogsPrice !== undefined) value.netProfit = sellingPrice - cogsPrice;
    }

    // Sanitize value: remove fields that shouldn't be updated in the set
    const updateDataObj = { ...value };
    delete updateDataObj.productId;
    delete updateDataObj._id;
    delete updateDataObj.createdAt;
    delete updateDataObj.updatedAt;

    const response = await updateData(productModel, { _id: productId }, updateDataObj, {});
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Product"), {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Product"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};


export const delete_product_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = deleteProductSchema.validate(req.params || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const response = await deleteData(productModel, { _id: isValidObjectId(value.id) });
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Product"), {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Product"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const get_all_product = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getProductsSchema.validate(req.query || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const { categoryId, category, brandId, sizeIds, colorIds, minPrice, maxPrice, inStockOnly, inStock, isTrending, isDealOfDay, sortFilter } = value;
    const sizeIdsFromBracket = value["sizeIds[]"];
    const colorIdsFromBracket = value["colorIds[]"];
    const resolvedSizeIds = sizeIds ?? sizeIdsFromBracket;
    const resolvedColorIds = colorIds ?? colorIdsFromBracket;
    const { criteria, options, page, limit } = resolveSortAndFilter(value, ["title", "sku"]);

    if (value.search) {
        const matchingCategories = await categoryModel.find({ name: { $regex: value.search, $options: "i" }, isDeleted: false }, { _id: 1 });
        const matchingBrands = await brandModel.find({ name: { $regex: value.search, $options: "i" }, isDeleted: false }, { _id: 1 });
        
        const categoryIdsSearch = matchingCategories.map(c => c._id);
        const brandIdsSearch = matchingBrands.map(b => b._id);

        if (categoryIdsSearch.length > 0 || brandIdsSearch.length > 0) {
            if (!criteria.$or) criteria.$or = [];
            if (categoryIdsSearch.length > 0) criteria.$or.push({ categoryId: { $in: categoryIdsSearch } });
            if (brandIdsSearch.length > 0) criteria.$or.push({ brandId: { $in: brandIdsSearch } });
        }
    }

    if (categoryId) criteria.categoryId = isValidObjectId(categoryId);

    if (category) {
      const categoryDoc = await getFirstMatch(categoryModel, { name: category, isDeleted: false }, {}, {});
      if (categoryDoc) {
        criteria.categoryId = isValidObjectId(categoryDoc._id);
      } else {
        return res.status(HTTP_STATUS.OK).json(
          new apiResponse(
            HTTP_STATUS.OK,
            responseMessage.getDataSuccess("Product"),
            { product_data: [], totalData: 0, state: resolvePagination(page, limit) },
            {}
          )
        );
      }
    }

    if (brandId) criteria.brandId = isValidObjectId(brandId);
    const parseBool = (input: any) => {
      if (input === true || input === false) return input;
      if (input === 1 || input === 0) return Boolean(input);
      const normalized = String(input || "")
        .trim()
        .toLowerCase();
      if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
      if (normalized === "false" || normalized === "0" || normalized === "no") return false;
      return null;
    };

    const trendingFlag = parseBool(isTrending);
    if (trendingFlag === true) criteria.isTrending = true;

    const dealFlag = parseBool(isDealOfDay);
    if (dealFlag === true) criteria.isDealOfDay = true;

    const saleFlag = parseBool(value.isSale);
    if (saleFlag === true) criteria.isSale = true;

    const stockFlag = parseBool(inStockOnly ?? inStock);
    if (stockFlag === true) criteria.isActive = true;

    const normalizeIds = (input: any) => {
      if (!input) return [];
      const rawList = Array.isArray(input) ? input : String(input).split(",");
      return rawList.map((id) => isValidObjectId(String(id).trim())).filter((id) => id !== null);
    };

    const sizeIdList = normalizeIds(resolvedSizeIds);
    if (sizeIdList.length) criteria.sizeIds = { $in: sizeIdList };

    const colorIdList = normalizeIds(resolvedColorIds);
    if (colorIdList.length) criteria.colorIds = { $in: colorIdList };

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (Number.isFinite(min) || Number.isFinite(max)) {
      criteria.sellingPrice = {};
      if (Number.isFinite(min)) criteria.sellingPrice.$gte = min;
      if (Number.isFinite(max)) criteria.sellingPrice.$lte = max;
    }

    if (sortFilter === "priceAsc") options.sort = { sellingPrice: 1 };
    else if (sortFilter === "priceDesc") options.sort = { sellingPrice: -1 };
    else if (sortFilter === "ratingDesc") options.sort = { rating: -1 };

    const response = await getData(productModel, criteria, {}, options);
    const totalCount = await countData(productModel, criteria);
    const stateObj = resolvePagination(page, limit);

    const productIds = response.map((product) => product?._id).filter(Boolean);
    const ratingSummaryMap = new Map<string, { avgRating: number; ratingCount: number }>();

    if (productIds.length > 0) {
      const ratingStats = await aggregateData(reviewModel, [{ $match: { productId: { $in: productIds }, isDeleted: false } }, { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }]);

      ratingStats.forEach((stat) => {
        ratingSummaryMap.set(String(stat._id), {
          avgRating: Number(stat.avgRating?.toFixed(2) || 0),
          ratingCount: stat.ratingCount || 0,
        });
      });
    }

    const enrichedResponse = response.map((product) => ({
      ...product,
      ratingSummary: ratingSummaryMap.get(String(product?._id)) || { avgRating: 0, ratingCount: 0 },
    }));

    return res.status(HTTP_STATUS.OK).json(
      new apiResponse(
        HTTP_STATUS.OK,
        responseMessage.getDataSuccess("Product"),
        {
          product_data: enrichedResponse,
          totalData: totalCount,
          state: stateObj,
        },
        {},
      ),
    );
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const get_product_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getProductByIdSchema.validate(req.params);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    const populate = [
      { path: "categoryId", select: "name" },
      { path: "sizeIds", select: "name" },
      { path: "colorIds", select: "name" },
    ];
    const response = await findOneAndPopulate(productModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {}, populate);
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Product"), {}, {}));
    const ratingSummary = await getRatingSummary(response._id);

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Product"), { ...response, ratingSummary }, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
  }
};
const getRatingSummary = async (productId) => {
  const ratingStats = await aggregateData(reviewModel, [{ $match: { productId, isDeleted: false } }, { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }]);

  if (!ratingStats?.length) return { avgRating: 0, ratingCount: 0 };

  return {
    avgRating: Number(ratingStats[0].avgRating.toFixed(2)),
    ratingCount: ratingStats[0].ratingCount,
  };
};
