/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     ForbiddenError:
 *       description: User does not have permission to access this resource
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: An error occurred
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: INVALID_INPUT
 *             details:
 *               type: string
 *               example: Additional error details
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: user123
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         subscription:
 *           type: object
 *           properties:
 *             tier:
 *               type: string
 *               enum: [free, subscription, premium]
 *               example: subscription
 *             expiresAt:
 *               type: string
 *               format: date-time
 *               example: 2025-06-15T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T00:00:00.000Z
 *     Business:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: business123
 *         name:
 *           type: string
 *           example: Acme Corporation
 *         foundingDate:
 *           type: string
 *           format: date
 *           example: 2020-01-01
 *         foundingTime:
 *           type: string
 *           format: time
 *           example: 10:30:00
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: New York
 *             state:
 *               type: string
 *               example: NY
 *             country:
 *               type: string
 *               example: USA
 *             latitude:
 *               type: number
 *               format: float
 *               example: 40.7128
 *             longitude:
 *               type: number
 *               format: float
 *               example: -74.0060
 *         industry:
 *           type: string
 *           example: Technology
 *         ownerId:
 *           type: string
 *           example: user123
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T00:00:00.000Z
 *     DailyHoroscope:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: horoscope123
 *         userId:
 *           type: string
 *           example: user123
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-05-15
 *         title:
 *           type: string
 *           example: Your Daily Business Horoscope
 *         overview:
 *           type: string
 *           example: Today is a favorable day for business decisions. The alignment of Jupiter with your natal Sun brings opportunities for growth and expansion.
 *         sections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Career
 *               content:
 *                 type: string
 *                 example: Focus on networking today. New connections made now could lead to profitable partnerships in the future.
 *         luckyNumbers:
 *           type: array
 *           items:
 *             type: integer
 *           example: [3, 7, 12, 28]
 *         favorableColors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["blue", "gold"]
 *         dosAndDonts:
 *           type: object
 *           properties:
 *             dos:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Schedule important meetings", "Review financial statements", "Network with industry peers"]
 *             donts:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Make impulsive decisions", "Sign contracts without review", "Ignore team input"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-15T00:00:00.000Z
 *     MonthlyReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: report123
 *         userId:
 *           type: string
 *           example: user123
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 5
 *         year:
 *           type: integer
 *           example: 2025
 *         title:
 *           type: string
 *           example: May 2025 Business Forecast
 *         overview:
 *           type: string
 *           example: May brings significant opportunities for business growth and development. The planetary alignments favor strategic planning and expansion initiatives.
 *         sections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Financial Outlook
 *               content:
 *                 type: string
 *                 example: The first half of the month is favorable for investments, particularly in technology and innovation. Exercise caution in the third week when Mercury goes retrograde.
 *         keyDates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-10
 *               description:
 *                 type: string
 *                 example: Favorable for contract negotiations
 *               planetaryInfluence:
 *                 type: string
 *                 example: Mercury trine Jupiter
 *         monthlyFocus:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Team building", "Market expansion", "Product development"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-01T00:00:00.000Z
 *     BusinessInsight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: insight123
 *         businessId:
 *           type: string
 *           example: business123
 *         type:
 *           type: string
 *           enum: [weekly, monthly, quarterly, yearly]
 *           example: monthly
 *         period:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date
 *               example: 2025-05-01
 *             endDate:
 *               type: string
 *               format: date
 *               example: 2025-05-31
 *         title:
 *           type: string
 *           example: May 2025 Business Astrological Insight
 *         overview:
 *           type: string
 *           example: The business natal chart shows significant activity in the 10th house of career and public reputation this month. This indicates a period of increased visibility and potential for recognition in your industry.
 *         sections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Leadership Dynamics
 *               content:
 *                 type: string
 *                 example: With Mars transiting your 1st house, leadership will be energized and proactive. Team members will respond well to direct communication and clear direction.
 *         recommendations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Marketing
 *               content:
 *                 type: string
 *                 example: Launch new marketing initiatives between May 5-15 when Venus aspects your natal Mercury, enhancing communication and creative expression.
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *         keyDates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-12
 *               description:
 *                 type: string
 *                 example: Ideal for important meetings or presentations
 *               planetaryInfluence:
 *                 type: string
 *                 example: Sun conjunct Jupiter
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-01T00:00:00.000Z
 *     BatchRequest:
 *       type: object
 *       properties:
 *         requests:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - method
 *               - path
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional client-generated ID for the request
 *                 example: req1
 *               method:
 *                 type: string
 *                 enum: [GET, POST, PUT, DELETE]
 *                 description: HTTP method
 *                 example: GET
 *               path:
 *                 type: string
 *                 description: API path (without the base URL)
 *                 example: /api/content/daily-horoscope
 *               body:
 *                 type: object
 *                 description: Request body for POST and PUT requests
 *                 example:
 *                   name: John Doe
 *               headers:
 *                 type: object
 *                 description: Additional headers for the request
 *                 example:
 *                   x-custom-header: value
 *     SyncOperation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the operation
 *           example: op123
 *         type:
 *           type: string
 *           enum: [create, update, delete]
 *           description: Type of operation
 *           example: update
 *         resource:
 *           type: string
 *           description: Resource type
 *           example: user_preferences
 *         resourceId:
 *           type: string
 *           description: ID of the resource
 *           example: pref123
 *         timestamp:
 *           type: integer
 *           format: int64
 *           description: Timestamp of the operation (milliseconds since epoch)
 *           example: 1620000000000
 *         data:
 *           type: object
 *           description: Data for create or update operations
 *           example:
 *             theme: dark
 *             notifications: true
 *         version:
 *           type: integer
 *           description: Version number for conflict detection
 *           example: 3
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: device123
 *         userId:
 *           type: string
 *           example: user123
 *         deviceId:
 *           type: string
 *           example: device-123456
 *         platform:
 *           type: string
 *           enum: [ios, android, web]
 *           example: ios
 *         model:
 *           type: string
 *           example: iPhone 14 Pro
 *         osVersion:
 *           type: string
 *           example: iOS 16.5
 *         pushToken:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: fcm-token-abcdef123456
 *             platform:
 *               type: string
 *               enum: [fcm, apns]
 *               example: apns
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: 2025-05-15T10:30:00.000Z
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           example: 2025-05-15T10:30:00.000Z
 *         settings:
 *           type: object
 *           properties:
 *             notifications:
 *               type: boolean
 *               example: true
 *             theme:
 *               type: string
 *               example: dark
 *             language:
 *               type: string
 *               example: en
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-15T10:30:00.000Z
 */
