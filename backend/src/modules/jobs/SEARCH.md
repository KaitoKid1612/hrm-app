# Enhanced Search & Filter - Jobs Module

Comprehensive search and filtering system for job listings with advanced features.

## 🔍 Search Endpoints

### 1. Advanced Job Search

**GET** `/jobs/search/all`

Search jobs with multiple filters, sorting, and pagination.

**Query Parameters:**

| Parameter        | Type     | Description                                              | Example                        |
| ---------------- | -------- | -------------------------------------------------------- | ------------------------------ |
| `page`           | number   | Page number (default: 1)                                 | `?page=2`                      |
| `limit`          | number   | Results per page (default: 10)                           | `?limit=20`                    |
| `keyword`        | string   | Search in title, description, requirements, company name | `?keyword=nodejs`              |
| `categoryId`     | string   | Filter by category ID                                    | `?categoryId=uuid`             |
| `jobType`        | enum     | FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE    | `?jobType=FULL_TIME`           |
| `jobLevel`       | enum     | INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEADER, MANAGER | `?jobLevel=SENIOR`             |
| `experience`     | enum     | NO_EXPERIENCE, UNDER_1_YEAR, 1_3_YEARS, 3_5_YEARS, etc.  | `?experience=3_5_YEARS`        |
| `city`           | string   | Single city filter                                       | `?city=Hà Nội`                 |
| `cities`         | string[] | Multiple cities (array)                                  | `?cities=Hà Nội&cities=TP.HCM` |
| `salaryMin`      | number   | Minimum salary                                           | `?salaryMin=10000000`          |
| `salaryMax`      | number   | Maximum salary                                           | `?salaryMax=30000000`          |
| `skills`         | string   | Comma-separated skill IDs                                | `?skills=uuid1,uuid2,uuid3`    |
| `companyId`      | string   | Filter by company                                        | `?companyId=uuid`              |
| `isHot`          | boolean  | Hot/featured jobs                                        | `?isHot=true`                  |
| `isUrgent`       | boolean  | Urgent hiring                                            | `?isUrgent=true`               |
| `sortBy`         | enum     | createdAt, salary, deadline, views, applications         | `?sortBy=salary`               |
| `sortOrder`      | enum     | asc, desc (default: desc)                                | `?sortOrder=desc`              |
| `postedAfter`    | date     | Jobs posted after date                                   | `?postedAfter=2024-01-01`      |
| `postedBefore`   | date     | Jobs posted before date                                  | `?postedBefore=2024-12-31`     |
| `deadlineAfter`  | date     | Deadline after date                                      | `?deadlineAfter=2024-12-15`    |
| `deadlineBefore` | date     | Deadline before date                                     | `?deadlineBefore=2024-12-31`   |

**Example Requests:**

```bash
# Basic search
GET /jobs/search/all?keyword=backend developer

# Search with filters
GET /jobs/search/all?keyword=nodejs&city=Hà Nội&jobType=FULL_TIME&salaryMin=15000000

# Search by skills
GET /jobs/search/all?skills=uuid1,uuid2&jobLevel=SENIOR

# Sort by salary
GET /jobs/search/all?sortBy=salary&sortOrder=desc&page=1&limit=20

# Multiple cities
GET /jobs/search/all?cities=Hà Nội&cities=TP.HCM&cities=Đà Nẵng

# Date range
GET /jobs/search/all?postedAfter=2024-12-01&deadlineBefore=2024-12-31
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Senior Backend Developer",
      "description": "...",
      "jobType": "FULL_TIME",
      "jobLevel": "SENIOR",
      "salaryMin": 20000000,
      "salaryMax": 30000000,
      "city": "Hà Nội",
      "deadline": "2024-12-31",
      "viewCount": 150,
      "company": {
        "id": "uuid",
        "name": "Tech Company",
        "logo": "https://...",
        "city": "Hà Nội"
      },
      "category": {
        "id": "uuid",
        "name": "IT - Phần mềm"
      },
      "skills": [
        {
          "skill": {
            "id": "uuid",
            "name": "Node.js"
          }
        }
      ],
      "_count": {
        "applications": 25
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

### 2. Search Suggestions (Autocomplete)

**GET** `/jobs/search/suggestions`

Get autocomplete suggestions for search queries.

**Query Parameters:**

- `query` (required): Search term (min 2 characters)
- `limit` (optional): Max results (default: 10)

**Example:**

```bash
GET /jobs/search/suggestions?query=back&limit=10
```

**Response:**

```json
{
  "jobs": ["Backend Developer", "Backend Engineer", "Backend Team Lead"],
  "companies": ["Backend Tech Solutions", "BackOffice Systems"],
  "skills": [
    { "id": "uuid1", "name": "Backend Development" },
    { "id": "uuid2", "name": "Backend Architecture" }
  ]
}
```

---

### 3. Trending/Popular Jobs

**GET** `/jobs/search/trending`

Get trending jobs (posted in last 7 days, sorted by views).

**Query Parameters:**

- `limit` (optional): Number of results (default: 10)

**Example:**

```bash
GET /jobs/search/trending?limit=5
```

**Response:** Array of job objects (same structure as search)

---

### 4. Similar Jobs

**GET** `/jobs/:id/similar`

Get jobs similar to a specific job (based on category, level, skills).

**Parameters:**

- `id` (path): Job ID
- `limit` (query, optional): Number of results (default: 5)

**Example:**

```bash
GET /jobs/uuid-123/similar?limit=5
```

**Response:** Array of job objects with `relevanceScore`

**Relevance Scoring:**

- Same category: +3 points
- Same level: +2 points
- Same city: +1 point
- Each matching skill: +1 point

---

### 5. Job Statistics

**GET** `/jobs/search/statistics`

Get aggregate statistics for building filter UI.

**Example:**

```bash
GET /jobs/search/statistics
```

**Response:**

```json
{
  "total": 1500,
  "byCategory": [
    { "id": "uuid", "name": "IT - Phần mềm", "count": 500 },
    { "id": "uuid", "name": "Marketing", "count": 200 }
  ],
  "byCity": [
    { "city": "Hà Nội", "count": 600 },
    { "city": "TP.HCM", "count": 500 }
  ],
  "byType": [
    { "type": "FULL_TIME", "count": 1000 },
    { "type": "PART_TIME", "count": 300 }
  ],
  "byLevel": [
    { "level": "SENIOR", "count": 400 },
    { "level": "MIDDLE", "count": 500 }
  ],
  "salaryRange": {
    "min": 5000000,
    "max": 50000000,
    "avgMin": 12000000,
    "avgMax": 20000000
  }
}
```

---

## 🎯 Use Cases

### 1. Job Board Homepage

```typescript
// Get trending jobs
const trending = await fetch('/jobs/search/trending?limit=10');

// Get statistics for filters
const stats = await fetch('/jobs/search/statistics');
```

### 2. Search with Autocomplete

```typescript
// User types "backe..."
const suggestions = await fetch('/jobs/search/suggestions?query=backe');

// Show suggestions: jobs, companies, skills
```

### 3. Advanced Filter Page

```typescript
// Multiple filters
const filters = {
  keyword: 'backend developer',
  cities: ['Hà Nội', 'TP.HCM'],
  jobType: 'FULL_TIME',
  jobLevel: 'SENIOR',
  salaryMin: 15000000,
  skills: 'uuid1,uuid2,uuid3',
  sortBy: 'salary',
  sortOrder: 'desc',
};

const results = await fetch(`/jobs/search/all?${new URLSearchParams(filters)}`);
```

### 4. Job Detail Page

```typescript
// Get job details
const job = await fetch('/jobs/uuid-123');

// Get similar jobs
const similar = await fetch('/jobs/uuid-123/similar?limit=5');
```

---

## 🔧 Implementation Details

### Full-Text Search

- Searches across: title, description, requirements, company name
- Case-insensitive matching
- Uses Prisma `contains` with `mode: 'insensitive'`

### Skill Filtering

- Jobs must have **at least one** of the specified skills
- Comma-separated skill IDs: `?skills=uuid1,uuid2,uuid3`

### Salary Filtering

- Respects jobs with `salaryNegotiate = true`
- Filter logic:
  - `salaryMin`: Job's min salary >= filter value OR negotiable
  - `salaryMax`: Job's max salary <= filter value OR negotiable

### Sorting Options

1. **createdAt** (default): Newest first
2. **salary**: Highest salary first (uses salaryMax, then salaryMin)
3. **deadline**: Soonest deadline first
4. **views**: Most viewed first
5. **applications**: Most applications first (in-memory sort)

### Relevance Algorithm (Similar Jobs)

```typescript
score = 0;
if (sameCategory) score += 3;
if (sameLevel) score += 2;
if (sameCity) score += 1;
score += matchingSkillsCount;
```

---

## 📊 Performance Considerations

### Indexing (Add to Prisma schema)

```prisma
model Job {
  // ... fields

  @@index([isActive, deadline]) // Main filter
  @@index([categoryId, isActive])
  @@index([city, isActive])
  @@index([jobType, isActive])
  @@index([jobLevel, isActive])
  @@index([viewCount]) // For trending
  @@index([createdAt]) // For sorting
}
```

### Caching Recommendations

```typescript
// Cache statistics (updates every hour)
const stats = await cache.get(
  'job-statistics',
  async () => {
    return jobsService.getJobStatistics();
  },
  { ttl: 3600 },
);

// Cache trending jobs (updates every 30 minutes)
const trending = await cache.get(
  'trending-jobs',
  async () => {
    return jobsService.getTrendingJobs(10);
  },
  { ttl: 1800 },
);
```

### Pagination Limits

- Default: 10 items per page
- Max: 100 items per page (add validation)

---

## 🧪 Testing Examples

### Test Search

```bash
# Search with keyword
curl "http://localhost:3000/jobs/search/all?keyword=developer&page=1&limit=10"

# Filter by multiple criteria
curl "http://localhost:3000/jobs/search/all?city=Hà%20Nội&jobType=FULL_TIME&salaryMin=15000000"

# Search by skills
curl "http://localhost:3000/jobs/search/all?skills=uuid1,uuid2"
```

### Test Autocomplete

```bash
curl "http://localhost:3000/jobs/search/suggestions?query=back"
```

### Test Similar Jobs

```bash
curl "http://localhost:3000/jobs/uuid-123/similar?limit=5"
```

### Test Statistics

```bash
curl "http://localhost:3000/jobs/search/statistics"
```

---

## 🚀 Frontend Integration

### React Example

```typescript
// Search hook
const useJobSearch = (filters) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await fetch(`/jobs/search/all?${params}`);
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, [filters]);

  return { jobs, loading };
};

// Usage
const { jobs, loading } = useJobSearch({
  keyword: 'backend',
  city: 'Hà Nội',
  jobType: 'FULL_TIME',
  page: 1,
});
```

### Autocomplete Component

```typescript
const SearchAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    if (query.length < 2) return;

    const fetchSuggestions = async () => {
      const res = await fetch(`/jobs/search/suggestions?query=${query}`);
      const data = await res.json();
      setSuggestions(data);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search jobs..."
    />
  );
};
```

---

## 🎨 Filter UI Example

```typescript
// Get statistics for building filters
const stats = await fetch('/jobs/search/statistics');

// Build dynamic filter options
<FilterSection>
  <CategoryFilter options={stats.byCategory} />
  <CityFilter options={stats.byCity} />
  <TypeFilter options={stats.byType} />
  <LevelFilter options={stats.byLevel} />
  <SalaryRange min={stats.salaryRange.min} max={stats.salaryRange.max} />
</FilterSection>
```

---

## 📝 Notes

- All searches filter only **active jobs** with **deadline >= today**
- Search is case-insensitive
- Multiple filters use AND logic (except skills which use OR)
- Skills filter: jobs must have at least one matching skill
- Salary filters respect `salaryNegotiate` flag
- Similar jobs algorithm prioritizes category > level > location > skills
- Trending jobs = posted in last 7 days, sorted by views
