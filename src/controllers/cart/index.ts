import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { cartModel, productModel } from '../../database';
import { createData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addToCartSchema, updateCartItemSchema, clearCartSchema, getCartSchema } from '../../validation';

export const add_to_cart = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addToCartSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        // Check if product exists
        const product = await getFirstMatch(productModel, { _id: isValidObjectId(value.productId), isDeleted: false }, {}, {});
        if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Product'), {}, {}));

        // Find existing cart for user or guest
        const userId = req?.user?._id;
        const criteria: any = userId ? { userId: isValidObjectId(userId.toString()), isDeleted: false } : { sessionId: value.sessionId, isDeleted: false };

        let cart: any = await getFirstMatch(cartModel, criteria, {}, {});

        if (!cart) {
            // Create new cart
            const cartData: any = { items: [{ productId: value.productId, quantity: value.quantity || 1, size: value.size, color: value.color }] };
            if (userId) cartData.userId = userId;
            else cartData.sessionId = value.sessionId;
            if (value.note) cartData.note = value.note;
            cart = await createData(cartModel, cartData);
        } else {
            // Add or update item in existing cart
            const items: any[] = cart.items || [];
            const existingIndex = items.findIndex(i => i.productId?.toString() === value.productId);
            if (existingIndex > -1) {
                items[existingIndex].quantity += (value.quantity || 1);
            } else {
                items.push({ productId: value.productId, quantity: value.quantity || 1, size: value.size, color: value.color });
            }
            cart = await updateData(cartModel, { _id: cart._id }, { items, note: value.note || cart.note }, {});
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Item added to cart', cart, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const update_cart_item = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = updateCartItemSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let cart: any = await getFirstMatch(cartModel, { _id: isValidObjectId(value.cartId), isDeleted: false }, {}, {});
        if (!cart) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Cart'), {}, {}));

        let items: any[] = cart.items || [];
        if (value.quantity === 0) {
            items = items.filter(i => i.productId?.toString() !== value.productId);
        } else {
            const idx = items.findIndex(i => i.productId?.toString() === value.productId);
            if (idx > -1) items[idx].quantity = value.quantity;
        }

        const updated = await updateData(cartModel, { _id: cart._id }, { items }, {});
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Cart updated', updated, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const clear_cart = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = clearCartSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const updated = await updateData(cartModel, { _id: isValidObjectId(value.cartId) }, { items: [], status: 'clear' }, {});
        if (!updated) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Cart'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Cart cleared', updated, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_cart = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getCartSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const userId = req?.user?._id;
        const criteria: any = userId ? { userId: isValidObjectId(userId.toString()), isDeleted: false } : { sessionId: value.sessionId, isDeleted: false };

        const cart = await getFirstMatch(cartModel, criteria, {}, {});
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Cart'), cart || {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
