# Corp Astro API Documentation

## Overview

This directory contains comprehensive documentation for the Corp Astro backend API. The documentation is organized into several guides that cover different aspects of the API, including mobile-specific enhancements, content generation, subscription management, and error handling.

## Documentation Structure

- [**API Documentation Index**](./index.md) - Main entry point for the API documentation
- [**Mobile API Guide**](./mobile-api-guide.md) - Detailed information about mobile-specific API enhancements
- [**Content API Guide**](./content-api-guide.md) - Guide to the content generation and delivery system
- [**Subscription System Guide**](./subscription-system-guide.md) - Guide to the subscription tier system
- [**Astro Engine Integration Guide**](./astro-engine-integration-guide.md) - Guide to integrating with the Astro Engine
- [**Error Handling Guide**](./error-handling-guide.md) - Comprehensive guide to API error handling

## Interactive API Documentation

In addition to these markdown guides, the Corp Astro backend provides interactive API documentation through Swagger UI. When the server is running, you can access the Swagger UI at:

- **Development**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Production**: [https://api.corp-astro.com/api-docs](https://api.corp-astro.com/api-docs)

The Swagger UI provides:

- Interactive exploration of all API endpoints
- Request/response schemas
- Example requests and responses
- Authentication requirements
- Error response details

## Using the Documentation

### For Mobile Developers

If you're developing the Corp Astro mobile application, start with the [Mobile API Guide](./mobile-api-guide.md), which covers:

- Device detection
- Response optimization
- Batch processing
- Offline support
- Push notifications

### For Content Developers

If you're working on content generation or integration, start with the [Content API Guide](./content-api-guide.md), which covers:

- Content types (daily horoscopes, monthly reports, business insights)
- Free tools
- Content generation process
- Caching strategy

### For Subscription Integration

If you're working on subscription or payment integration, start with the [Subscription System Guide](./subscription-system-guide.md), which covers:

- Subscription tiers
- Feature access control
- Payment integration
- Subscription lifecycle

### For Astrology Integration

If you're working on astrological calculations or integration with the Astro Engine, start with the [Astro Engine Integration Guide](./astro-engine-integration-guide.md), which covers:

- Chart calculations
- Planetary positions
- Predictive features
- API reference

### For Error Handling

For comprehensive information about error handling, refer to the [Error Handling Guide](./error-handling-guide.md), which covers:

- Error response format
- HTTP status codes
- Error categories
- Common error codes
- Best practices

## Keeping Documentation Updated

This documentation is maintained alongside the codebase. When making changes to the API:

1. Update the relevant markdown guides in this directory
2. Update the Swagger annotations in the code
3. Ensure the Swagger UI is working correctly

## Contributing to Documentation

To contribute to this documentation:

1. Fork the repository
2. Make your changes
3. Submit a pull request

Please follow these guidelines:

- Use clear, concise language
- Include examples where appropriate
- Follow the existing structure and formatting
- Test any code examples

## Contact

If you have any questions or need assistance with the API documentation, please contact:

- **Support Email**: support@corp-astro.com
- **Developer Portal**: https://developers.corp-astro.com
