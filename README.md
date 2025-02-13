# **TinyApp Project**

## **Goal**  
TinyApp is a full-stack web application built with **Node.js** and **Express.js** that allows users to shorten long URLs, similar to services like **TinyURL** and **bit.ly**. Users can create, manage, and access their custom short links.

---

## **Project Outcome**  
This project delivers a multi-page app with the following features:

 **User authentication** for protected actions.  
 **CRUD functionalities** for URL management (Create, Read, Update, Delete).  
 **Dynamic behavior** based on the user's login state.  

---

## **User Stories**  
 **As an avid Twitter poster:**  
- I want to shorten links so that I can fit more non-link text in my tweets.  

 **As a Twitter reader:**  
- I want to visit sites via shortened links to read interesting content.  

 **(Stretch Goal) As an avid Twitter poster:**  
- I want to track the number of visits to my links to understand user engagement.  

---

## **Features and Route Checklist**  

### ** Authentication and User Management**  
| Route          | Behavior |
|---------------|-----------|
| **GET /login** | If logged in: Redirects to `/urls`. If not logged in: Displays a login form. |
| **POST /login** | Valid credentials: Logs in and redirects to `/urls`. Invalid credentials: Returns an error message. |
| **GET /register** | If logged in: Redirects to `/urls`. If not logged in: Displays a registration form. |
| **POST /register** | Empty email/password: Returns an error message. Existing email: Returns an error. New user: Registers, hashes the password, and redirects to `/urls`. |
| **POST /logout** | Deletes session cookies and redirects to `/login`. |

---

### ** URL Management**  
| Route          | Behavior |
|---------------|-----------|
| **GET /** | If logged in: Redirects to `/urls`. If not logged in: Redirects to `/login`. |
| **GET /urls** | If logged in: Displays the user's shortened URLs with edit, delete, and create options. If not logged in: Returns an error message. |
| **GET /urls/new** | If logged in: Displays a form for creating a new short URL. If not logged in: Redirects to `/login`. |
| **POST /urls** | If logged in: Creates a new short URL and associates it with the user. If not logged in: Returns an error message. |
| **GET /urls/:id** | If logged in and **owns** the URL: Displays URL details and an edit form. If the URL **doesn't exist**: Returns an error message. |
| **POST /urls/:id** | If logged in and **owns** the URL: Updates the long URL and redirects to `/urls`. If not logged in or doesn't own the URL: Returns an error message. |
| **POST /urls/:id/delete** | If logged in and **owns** the URL: Deletes the URL and redirects to `/urls`. If not logged in or doesn't own the URL: Returns an error message. |
| **GET /u/:id** | If the short URL exists: Redirects to the corresponding long URL. If the short URL doesn't exist: Returns an error message. |

---

## **Display and Navigation Features**
### **Site Header:**
-  If logged in: Displays the user's email and a logout button.  
-  If not logged in: Displays links to login and register pages.  

### **URL List Page:**
- Displays a table of URLs with:
  - **Short URL**, **Long URL**, and **Delete button**.

---

## **Final Product**  
Screenshots of the project:

!["Screenshot of register page"](https://github.com/amzia99/tinyapp1/blob/master/docs/Register.PNG?raw=true)
!["Screenshot of main page"](https://github.com/amzia99/tinyapp1/blob/master/docs/My%20URLs.PNG?raw=true)
!["Screenshot of create url page"](https://github.com/amzia99/tinyapp1/blob/master/docs/Create%20URLs.PNG?raw=true)
!["Screenshot of url list page"](https://github.com/amzia99/tinyapp1/blob/master/docs/List%20of%20URLs.PNG?raw=true)
!["Screenshot of login page"](https://github.com/amzia99/tinyapp1/blob/master/docs/Login.PNG?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- method-override (not implemented)

---

## **Getting Started**
1. Clone the repository.
2. Install all dependencies using:
   ```sh
   npm install
3. Start the web development server using:
   npm start
4. Open your browser and go to:
   http://localhost:8080/

---

## **Author**
Abdullah Zia, created as part of the Lighthouse Labs Web Development Program
