import random

from locust import HttpUser, TaskSet, between, task

KEY = "THIS_IS_A_TEST_KEY"


class UserBehavior(TaskSet):
    def on_start(self):
        """Executed when a simulated user starts."""
        self.email = f"user{random.randint(1, 1000)}@test.com"
        self.password = "password123"
        self.token = None
        self.user_id = None
        self.signup()
        self.signin()

    def signup(self):
        """Simulate user registration."""
        response = self.client.post(
            "/api/signup",
            json={
                "username": f"User{random.randint(1, 1000)}",
                "email": self.email,
                "password": self.password,
            },
        )
        if response.status_code == 200:
            self.token = response.json().get("token")

    def signin(self):
        """Simulate user login."""
        response = self.client.post(
            "/api/signin", json={"email": self.email, "password": self.password}
        )
        if response.status_code == 200:
            self.token = response.json().get("token")

    def get_headers(self):
        """Return headers with authentication token."""
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(2)
    def fetch_parking_slots(self):
        """Simulate retrieving available parking slots."""
        self.client.get("/api/parkingSlots", headers=self.get_headers())

    @task(3)
    def book_parking(self):
        """Simulate booking a random parking slot."""
        parking_id = random.randint(1, 100)  # Simulating parking slots
        response = self.client.post(
            "/api/booking",
            json={"parkingId": parking_id, "userId": self.user_id},
            headers=self.get_headers(),
        )
        if response.status_code == 400:
            print(f"Failed to book slot {parking_id}: {response.json().get('message')}")

    @task(1)
    def add_review(self):
        """Simulate a user leaving a review."""
        review = f"Great parking! {random.randint(1, 5)} stars."
        self.client.post(
            "/api/review",
            json={"userId": self.user_id, "review": review},
            headers=self.get_headers(),
        )

    @task(1)
    def fetch_bookings(self):
        """Simulate retrieving a user's past bookings."""
        self.client.get(
            f"/api/fetchBookings?userId={self.user_id}", headers=self.get_headers()
        )

    @task(1)
    def protected_endpoint(self):
        """Test access to a protected route."""
        self.client.get("/api/protected", headers=self.get_headers())


class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)
