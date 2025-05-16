// src/services/subscription/swagger/tier.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionTierType:
 *       type: string
 *       enum: [free, subscription, premium]
 *       description: Type of subscription tier
 *     
 *     TierFeatures:
 *       type: object
 *       properties:
 *         nameNumberAnalysis:
 *           type: boolean
 *           description: Access to name number analysis tool
 *         taglineAnalysis:
 *           type: boolean
 *           description: Access to tagline analysis tool
 *         brandColorAnalysis:
 *           type: boolean
 *           description: Access to brand color analysis tool
 *         dailyHoroscope:
 *           type: boolean
 *           description: Access to personalized daily horoscopes
 *         monthlyReport:
 *           type: boolean
 *           description: Access to monthly astrological reports
 *         astroRatanChat:
 *           type: boolean
 *           description: Access to Astro Ratan AI chat
 *         humanAstrologerAccess:
 *           type: boolean
 *           description: Access to human astrologer consultations
 *         businessCompatibility:
 *           type: boolean
 *           description: Access to business compatibility analysis
 *         maxBusinessProfiles:
 *           type: integer
 *           description: Maximum number of business profiles allowed
 *         maxSavedReports:
 *           type: integer
 *           description: Maximum number of saved reports allowed
 *         adFree:
 *           type: boolean
 *           description: Ad-free experience
 *     
 *     TierDetails:
 *       type: object
 *       properties:
 *         tier:
 *           $ref: '#/components/schemas/SubscriptionTierType'
 *         plan:
 *           type: object
 *           properties:
 *             plan_id:
 *               type: integer
 *               description: Unique identifier for the plan
 *             plan_name:
 *               type: string
 *               description: Name of the subscription plan
 *             plan_description:
 *               type: string
 *               description: Description of the subscription plan
 *             tier_type:
 *               $ref: '#/components/schemas/SubscriptionTierType'
 *             monthly_price:
 *               type: number
 *               format: float
 *               description: Monthly price of the subscription plan
 *             quarterly_price:
 *               type: number
 *               format: float
 *               description: Quarterly price of the subscription plan
 *             biannual_price:
 *               type: number
 *               format: float
 *               description: Biannual price of the subscription plan
 *             annual_price:
 *               type: number
 *               format: float
 *               description: Annual price of the subscription plan
 *             currency:
 *               type: string
 *               description: Currency of the prices
 *             is_active:
 *               type: boolean
 *               description: Whether the plan is active
 *         features:
 *           $ref: '#/components/schemas/TierFeatures'
 *     
 *     TierComparison:
 *       type: object
 *       properties:
 *         tiers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 $ref: '#/components/schemas/SubscriptionTierType'
 *               pricing:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                     format: float
 *                   quarterly:
 *                     type: number
 *                     format: float
 *                   biannual:
 *                     type: number
 *                     format: float
 *                   annual:
 *                     type: number
 *                     format: float
 *               features:
 *                 $ref: '#/components/schemas/TierFeatures'
 */

/**
 * @swagger
 * /api/subscription/tiers/all:
 *   get:
 *     summary: Get all available subscription tiers
 *     tags: [Subscription Tiers]
 *     responses:
 *       200:
 *         description: List of all subscription tiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TierDetails'
 *       500:
 *         description: Server error
 * 
 * /api/subscription/tiers/details/{tierType}:
 *   get:
 *     summary: Get details for a specific subscription tier
 *     tags: [Subscription Tiers]
 *     parameters:
 *       - in: path
 *         name: tierType
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/SubscriptionTierType'
 *         description: Type of subscription tier
 *     responses:
 *       200:
 *         description: Details of the specified tier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TierDetails'
 *       400:
 *         description: Invalid tier type
 *       500:
 *         description: Server error
 * 
 * /api/subscription/tiers/compare:
 *   get:
 *     summary: Compare all subscription tiers side by side
 *     tags: [Subscription Tiers]
 *     responses:
 *       200:
 *         description: Comparison of all tiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TierComparison'
 *       500:
 *         description: Server error
 * 
 * /api/subscription/tiers/current:
 *   get:
 *     summary: Get the current user's subscription tier
 *     tags: [Subscription Tiers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's tier and features
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     tier:
 *                       $ref: '#/components/schemas/SubscriptionTierType'
 *                     features:
 *                       $ref: '#/components/schemas/TierFeatures'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 * 
 * /api/subscription/tiers/feature/{featureName}:
 *   get:
 *     summary: Check if the current user has access to a specific feature
 *     tags: [Subscription Tiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: featureName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the feature to check access for
 *     responses:
 *       200:
 *         description: Feature access check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     feature:
 *                       type: string
 *                     hasAccess:
 *                       type: boolean
 *       400:
 *         description: Invalid feature name
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
