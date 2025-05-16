/**
 * @swagger
 * tags:
 *   name: Mobile
 *   description: Mobile-specific API endpoints and optimizations
 */

/**
 * @swagger
 * /api/mobile/device/register:
 *   post:
 *     summary: Register a mobile device for push notifications
 *     description: |
 *       Registers a mobile device to receive push notifications.
 *       This endpoint should be called when a user logs in on a mobile device or when the push token is refreshed.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - token
 *               - platform
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *                 example: device-123456
 *               token:
 *                 type: string
 *                 description: Push notification token (FCM or APNS)
 *                 example: fcm-token-abcdef123456
 *               platform:
 *                 type: string
 *                 enum: [fcm, apns]
 *                 description: Push notification platform (fcm for Android/Web, apns for iOS)
 *                 example: fcm
 *     responses:
 *       200:
 *         description: Device registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Device registered successfully
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/device/unregister:
 *   post:
 *     summary: Unregister a mobile device from push notifications
 *     description: |
 *       Unregisters a mobile device to stop receiving push notifications.
 *       This endpoint should be called when a user logs out or when push notifications are disabled.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *                 example: device-123456
 *     responses:
 *       200:
 *         description: Device unregistered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Device unregistered successfully
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/config:
 *   get:
 *     summary: Get mobile-specific configuration
 *     description: |
 *       Returns mobile-specific configuration settings.
 *       The response is customized based on device capabilities detected from request headers.
 *     tags: [Mobile]
 *     responses:
 *       200:
 *         description: Mobile configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     responseOptimization:
 *                       type: object
 *                       properties:
 *                         compressionThreshold:
 *                           type: number
 *                           example: 2
 *                         defaultImageQuality:
 *                           type: number
 *                           example: 85
 *                     bandwidthOptimization:
 *                       type: object
 *                       properties:
 *                         defaultPageSize:
 *                           type: number
 *                           example: 20
 *                         maxPageSize:
 *                           type: number
 *                           example: 100
 *                     batteryOptimization:
 *                       type: object
 *                       properties:
 *                         defaultSyncInterval:
 *                           type: number
 *                           example: 60
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/profile:
 *   get:
 *     summary: Get user profile with mobile-optimized data
 *     description: |
 *       Returns the user profile with data optimized for mobile devices.
 *       The response is customized based on device capabilities detected from request headers.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: user123
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         tier:
 *                           type: string
 *                           enum: [free, subscription, premium]
 *                           example: subscription
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-06-15T00:00:00.000Z
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         notifications:
 *                           type: boolean
 *                           example: true
 *                         theme:
 *                           type: string
 *                           example: light
 *                         language:
 *                           type: string
 *                           example: en
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/content/{contentType}:
 *   get:
 *     summary: Get mobile-optimized content by type
 *     description: |
 *       Returns content optimized for mobile devices based on the content type.
 *       The response is customized based on device capabilities detected from request headers.
 *     tags: [Mobile, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [daily_horoscope, monthly_report, business_insight]
 *         description: Type of content to retrieve
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *         example: title,content,date
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/DailyHoroscope'
 *                     - $ref: '#/components/schemas/MonthlyReport'
 *                     - $ref: '#/components/schemas/BusinessInsight'
 *       400:
 *         description: Bad request - invalid content type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/content/{contentType}/{contentId}:
 *   get:
 *     summary: Get mobile-optimized content by type and ID
 *     description: |
 *       Returns specific content optimized for mobile devices based on the content type and ID.
 *       The response is customized based on device capabilities detected from request headers.
 *     tags: [Mobile, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [daily_horoscope, monthly_report, business_insight]
 *         description: Type of content to retrieve
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *         example: title,content,date
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/DailyHoroscope'
 *                     - $ref: '#/components/schemas/MonthlyReport'
 *                     - $ref: '#/components/schemas/BusinessInsight'
 *       400:
 *         description: Bad request - invalid content type or ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/device/settings:
 *   post:
 *     summary: Update device settings
 *     description: |
 *       Updates settings for a specific device.
 *       This allows storing device-specific preferences.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - settings
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *                 example: device-123456
 *               settings:
 *                 type: object
 *                 description: Device settings
 *                 example:
 *                   notifications: true
 *                   theme: dark
 *                   language: en
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Device settings updated successfully
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/business/{businessId}:
 *   get:
 *     summary: Get mobile-optimized business data
 *     description: |
 *       Returns business data optimized for mobile devices.
 *       The response is customized based on device capabilities detected from request headers.
 *     tags: [Mobile, Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to retrieve
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *         example: name,foundingDate,chart
 *     responses:
 *       200:
 *         description: Business data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: business123
 *                     name:
 *                       type: string
 *                       example: Acme Corporation
 *                     foundingDate:
 *                       type: string
 *                       format: date
 *                       example: 2020-01-01
 *                     location:
 *                       type: string
 *                       example: New York, NY
 *                     industry:
 *                       type: string
 *                       example: Technology
 *                     chart:
 *                       type: object
 *                       properties:
 *                         ascendant:
 *                           type: string
 *                           example: Aries
 *                         sun:
 *                           type: string
 *                           example: Taurus
 *                         moon:
 *                           type: string
 *                           example: Gemini
 *                     insights:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: weekly
 *                           id:
 *                             type: string
 *                             example: w123
 *                           title:
 *                             type: string
 *                             example: Weekly Insight
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: 2025-05-16
 *       400:
 *         description: Bad request - invalid business ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/batch:
 *   post:
 *     summary: Process multiple API requests in a single batch
 *     description: |
 *       Allows sending multiple API requests in a single HTTP request.
 *       This reduces network overhead and battery usage on mobile devices.
 *       Each request in the batch is processed independently, and the responses are returned in the same order.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchRequest'
 *     responses:
 *       200:
 *         description: Batch processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: integer
 *                         example: 200
 *                       body:
 *                         type: object
 *                         example:
 *                           success: true
 *                           data:
 *                             title: Daily Horoscope
 *                             content: Today is a favorable day for business decisions...
 *                       error:
 *                         type: string
 *                         example: null
 *       400:
 *         description: Bad request - invalid batch format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/mobile/sync:
 *   get:
 *     summary: Get changes since last sync
 *     description: |
 *       Returns changes that have occurred since the last synchronization.
 *       This endpoint is used for offline data synchronization.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the device
 *       - in: header
 *         name: client-id
 *         schema:
 *           type: string
 *         description: Unique identifier for the client instance
 *       - in: query
 *         name: lastSync
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Timestamp of the last synchronization (milliseconds since epoch)
 *         example: 1620000000000
 *       - in: query
 *         name: resources
 *         schema:
 *           type: string
 *         description: Comma-separated list of resource types to sync
 *         example: users,content
 *     responses:
 *       200:
 *         description: Changes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     changes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SyncOperation'
 *                     conflicts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: conflict1
 *                           clientOperation:
 *                             $ref: '#/components/schemas/SyncOperation'
 *                           serverOperation:
 *                             $ref: '#/components/schemas/SyncOperation'
 *                           resolved:
 *                             type: boolean
 *                             example: false
 *                     timestamp:
 *                       type: integer
 *                       format: int64
 *                       example: 1621234567890
 *       400:
 *         description: Bad request - missing required headers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Submit client changes
 *     description: |
 *       Submits changes from the client to be synchronized with the server.
 *       This endpoint is used for offline data synchronization.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the device
 *       - in: header
 *         name: client-id
 *         schema:
 *           type: string
 *         description: Unique identifier for the client instance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - changes
 *             properties:
 *               changes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SyncOperation'
 *     responses:
 *       200:
 *         description: Changes processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     applied:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SyncOperation'
 *                     conflicts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: conflict1
 *                           clientOperation:
 *                             $ref: '#/components/schemas/SyncOperation'
 *                           serverOperation:
 *                             $ref: '#/components/schemas/SyncOperation'
 *                           resolved:
 *                             type: boolean
 *                             example: false
 *                     timestamp:
 *                       type: integer
 *                       format: int64
 *                       example: 1621234567890
 *       400:
 *         description: Bad request - missing required headers or invalid changes format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   put:
 *     summary: Resolve sync conflicts
 *     description: |
 *       Resolves conflicts that occurred during synchronization.
 *       This endpoint is used for offline data synchronization.
 *     tags: [Mobile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the device
 *       - in: header
 *         name: client-id
 *         schema:
 *           type: string
 *         description: Unique identifier for the client instance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conflicts
 *             properties:
 *               conflicts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - resolution
 *                     - data
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the conflict to resolve
 *                       example: conflict1
 *                     resolution:
 *                       type: string
 *                       enum: [client-wins, server-wins, manual]
 *                       description: Resolution strategy
 *                       example: client-wins
 *                     data:
 *                       type: object
 *                       description: Resolved data
 *                       example:
 *                         name: Resolved Name
 *     responses:
 *       200:
 *         description: Conflicts resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     resolved:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [conflict1]
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     timestamp:
 *                       type: integer
 *                       format: int64
 *                       example: 1621234567890
 *       400:
 *         description: Bad request - missing required headers or invalid conflicts format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
