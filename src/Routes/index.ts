"use strict"
import { Router } from 'express'
import { authRouter } from './auth'
import { categoryRouter } from './category'
import { brandRouter } from './brand'
import { productRouter } from './product'
import { reviewRouter } from './review'
import { bannerRouter } from './banner'
import { blogRouter } from './blog'
import { faqRouter } from './faq'
import { newsletterRouter } from './newsletter'
import { contactRouter } from './contact'
import { settingsRouter } from './settings'
import { couponRouter } from './coupon'
import { policyRouter } from './policy'
import { cartRouter } from './cart'
import { wishlistRouter } from './wishlist'
import { aboutRouter } from './about'
import { igPostRouter } from './ig-post'
import { sizeRouter } from './size'
import { colorRouter } from './color'
import { faqCategoryRouter } from './faq-category'
import { userRouter } from './user'
import { uploadRouter } from './upload'
import { addressRouter } from './address'

const router = Router()


router.use('/auth', authRouter)

router.use('/category', categoryRouter)
router.use('/brand', brandRouter)
router.use('/product', productRouter)
router.use('/review', reviewRouter)
router.use('/banner', bannerRouter)
router.use('/blog', blogRouter)
router.use('/faq', faqRouter)
router.use('/faq-category', faqCategoryRouter)
router.use('/newsletter', newsletterRouter)
router.use('/contact', contactRouter)
router.use('/settings', settingsRouter)
router.use('/coupon', couponRouter)
router.use('/policy', policyRouter)
router.use('/cart', cartRouter)
router.use('/wishlist', wishlistRouter)
router.use('/about', aboutRouter)
router.use('/ig-post', igPostRouter)
router.use('/size', sizeRouter)
router.use('/color', colorRouter)
router.use('/user', userRouter)
router.use('/upload', uploadRouter)
router.use('/address', addressRouter)

export { router }
