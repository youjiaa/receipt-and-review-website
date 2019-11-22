
# College Park Student Housing Finder

---

Name: Theodore Gwo

Date: 19 October 2019

Project Topic: College Park Housing

URL: https://cp-housing.herokuapp.com/

---


### 1. Data Format and Storage

Data point fields:
- `community`: The apartment complex or neighborhood for the listing   `Type: string`
- `description`: A brief description by the lessor about the place for rent       `Type: string`
- `beds`:    The number of bedrooms in the unit       `Type: number`
- `baths`:    The number of bathrooms in the unit     `Type: number`
- `rent`:  The based rent cost per month        `Type: number `
- `div`: How the rent is split up among residents of the unit. Do they make one combined payment or each pay for just their bedroom?           `Type: string/text (selection via radio button) `
- `address`:  The address where the listing is located         `Type: text `
- `name`:  The name of the lessor         `Type: text `
- `phone`:     The phone number of the lessor      `Type: text `
- `features`:  The features that the lessor markets to a potential tenant     `Type: Array (passed in as a comma separated string) `
- `length`: The length of the lease term: is it flexible? Are 10 month leases available?  `Type: text (selection via radio button`
- `time`:  The time that this posting was made         `Type: text`

Schema: 
```javascript
{"community":"The Varsity","description":"Overly expensive apartment located close to class for CS majors and engineering students. Apartment is available immediately for sublease. Friendly roommates and very very slow wifi!","beds":"4","baths":"4","rent":"56666","div":"Per Person","addr":"8657 Baltimore Ave. College Park, MD 20740","name":"Larry Landlord","phone":"555-789-1111","features":["Phone"," Wifi"," Door"," Floor"," Walls"," Carpet"," Windows"," Lights"," Electricity"," Roommates"," Elevator"," Parking available on site"],"length":"12 Months","time":"October 20th 2019, 12:03 am"}
```

### 2. Add New Data

HTML form route: `/addlisting`

POST endpoint route: `/api/addlisting`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/addlisting',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
      community: "The Varsity",
      description: "Overly expensive apartment located close to class for CS majors and engineering students. Apartment is available immediately for sublease. Friendly roommates and very very slow wifi!",
      beds: "4",
      baths: "4",
      rent: "56666",
      div: "Per Person",
      addr: "8657 Baltimore Ave. College Park, MD 20740",
      name: "Larry Landlord",
      phone: "555-789-1111",
      features: ["Phone"," Wifi"," Door"," Floor"," Walls"," Carpet"," Windows"," Lights"," Electricity"," Roommates"," Elevator"," Parking available on site"],
      length: "12 Months",
      time: "October 20th 2019, 12:03 am"
      }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/listings`

### 4. Search Data

Search Field: community

### 5. Navigation Pages

Navigation Filters
1. All Listings (by order added) -> ` /listings  `
2. Random Listing -> `  /random  `
3. Ten Month (Academic Year) Leases -> ` /tenmonth   `
4. Most recently Added Listing -> `  /new  `
5. Listings under $1000/month -> `  /underonek  `
6. By-the-bed listings -> `/bythebed`

