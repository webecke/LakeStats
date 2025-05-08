# LakeStats

A simple PWA to show current and historical conditions at various lakes run by the Bureau of Reclamation.

## What
The goal is to make a simple webapp that:
- Simply displays the important info
  - Current lake elevation
  - Change over a week
  - Change since a year
  - Weather
  - Boat Ramp Availability
- Loads quickly (to work well at the Lake with slow connections)
- Looks nice
- Caches data for offline access

## Why
Other websites exist that display this information. However, currently they have frustrating user interfaces, cluttered data presentation, and load slowly. This project seeks to fix that.

Additionally, I just want to have a project to learn new technologies. This project will be the first time that I am using:
- Google Cloud Run
- Google Firebase
- React

## Deployment
This is not an open source project. I retain all possible rights to this code. However, for testing purposes or my own future documentation, here's info about how to deploy this: [deployment.md](deployment.md)




<!--
# LakeStats Project Specification

## Project Overview
LakeStats is a web application that provides real-time and historical data about major lakes, with an initial focus on Lake Powell and Lake Mead. The project aims to help visitors and enthusiasts access important information about lake conditions, access points, and historical trends.

## Core User Stories

### Lake Visitors
- As a lake visitor, I want to see current lake levels so I can plan my visit
- As a boat owner, I want to know which boat ramps are accessible at current water levels
- As a visitor, I want to see historical water level trends to understand the best times to visit
- As a marina user, I want to know if my preferred marina is currently accessible

### Lake Enthusiasts
- As an enthusiast, I want to track long-term lake level trends
- As a researcher, I want to access historical data about lake conditions
- As an environmental advocate, I want to understand water usage patterns

### Site Administrators
- As an admin, I want to manage which lakes are visible to the public
- As an admin, I want to configure data sources for each lake
- As an admin, I want to monitor system health and data collection status

## Data Model

The following diagram shows the relationships between the main data types in the system:

```mermaid
[Previous data-types diagram content]
```

## System Architecture

The following diagram shows the overall system architecture and data flow:

```mermaid
[Previous architecture diagram content]
```

### Frontend (React)
- Public interface for lake visitors
- Admin interface for lake management
- Interactive data visualizations
- Responsive design for mobile users

### Backend (Spring Boot)
- Data collection from various sources
- Data aggregation and analysis
- API endpoints for frontend consumption
- Authentication and authorization

### Data Storage (Firebase)
- Lake configuration and metadata
- User authentication
- Historical data caching
- System error logging

## Data Flow

1. Data Collection
  - Bureau of Reclamation APIs
  - Other potential data sources
  - Daily data collection jobs

2. Data Processing
  - Raw data validation
  - Calculation of derived metrics
  - Historical trend analysis

3. Data Publishing
  - API endpoints for frontend
  - Real-time updates
  - Historical data access

## API Contracts

### Public API Endpoints
```
GET /api/{lakeId}/current
- Current lake conditions
- Access point status
- Recent trends

GET /api/{lakeId}/historical
- Historical water levels
- Trend analysis
- Seasonal patterns
```

### Admin API Endpoints
```
GET /api/admin/lakes
POST /api/admin/lakes
PUT /api/admin/lakes/{lakeId}
- Lake management
- Data source configuration
- Feature toggles
```

## Feature Roadmap

### Phase 1 (Current)
- ✅ Basic lake information display
- ✅ Admin interface for lake management
- ✅ Data collection from Bureau of Reclamation
- ✅ Authentication for admin users

### Phase 2 (Near-term)
- Interactive water level visualizations
- Boat ramp accessibility tracking
- Public API documentation
- Enhanced error handling and monitoring

### Phase 3 (Future)
- Mobile app development
- Additional data sources integration
- Advanced analytics and predictions
- User accounts for saving preferences

## Technical Considerations

### Performance
- Efficient data caching strategies
- Optimization of database queries
- Frontend performance monitoring

### Security
- Admin authentication
- API rate limiting
- Data validation and sanitization

### Scalability
- Modular architecture for adding new lakes
- Flexible data source integration
- Cloud-native deployment

## Quality Assurance

### Testing Strategy
- Unit tests for core business logic
- Integration tests for API endpoints
- End-to-end testing for critical flows

### Monitoring
- Error tracking and alerting
- Data collection job monitoring
- API performance metrics

## Notes and Future Considerations
- Potential integration with weather services
- Mobile app development
- Community features (user comments, photos)
- Integration with marina booking systems

-->
