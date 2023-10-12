function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "admin" && password === "admin") {
        window.location.href = "admin.html";
    } else {   
        // Retrieve user data from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username and password match any user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) 
    {
        document.getElementById("userwelcome").style.display = "block";

        // Hide the login form
        document.getElementById("mainloginform").style.display = "none";

        // Display a welcome message with the username
        document.getElementById("loggedInUsername").textContent = user.username;



        //display tasks for user
        document.getElementById("taskDetails").style.display = "block";
        // Retrieve and display task details for the user
        const taskDetailsDiv = document.getElementById("taskDetails");
        taskDetailsDiv.innerHTML = ''; // Clear any previous content

        if (user.taskName && user.taskTime) {
            const taskElement = document.createElement("div");
           taskElement.innerHTML = `
            <h3>Task Name: ${user.taskName}</h3>
            <p>Time Left: <span id="taskTimer" class="timer"></span></p>
          `;
            taskDetailsDiv.appendChild(taskElement);
            // Call the startCountdown function for each user's task
    const taskTimeInSeconds = user.taskTime * 60;
    const taskTimerDisplay = taskElement.querySelector("#taskTimer");
    
    startCountdown(taskTimeInSeconds, taskTimerDisplay);
            }
        else {
            taskDetailsDiv.textContent = "No tasks found for this user.";
        }
    }
        else {
            alert('Invalid username or password. Please try again.');
        }
}
    return false; 
}

 

// Function to start a countdown timer
function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    const intervalId = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
  
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
  
      display.textContent = minutes + ":" + seconds;
  
      if (--timer < 0) {
        clearInterval(intervalId);
        display.textContent = "Time's up!";
      }
    }, 1000);
  }
  

 
 // Function to update user data in local storage
 function updateUserInStorage(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}


// Function to display user data to admin from local storage
function displayUsers() {
    const userListDiv = document.getElementById('userList');
    const users = JSON.parse(localStorage.getItem('users'));

    if (users && users.length > 0) {
        // Create a list to display users
        const userList = document.createElement('ul');

        users.forEach((user, index) => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `Username: ${user.username}, ID: ${user.id}, Password: ${user.password}
                <button class="assignTaskButton" data-index="${index}">Assign Task</button>
                <div class="assign-task-form" id="assignTaskForm${index}" style="display: none;">
                    <h3>Assign Task</h3>
                    <form id="taskForm" action="#" method="post">
                        <label for="taskName">Task Name:</label>
                        <input type="text" id="taskName${index}" name="taskName" required><br><br>

                        <label for="taskTime">Task Time (minutes):</label>
                        <input type="number" id="taskTime${index}" name="taskTime" required><br><br>

                        <input type="submit" value="Assign Task" id="assignTaskButton">
                    </form>
                </div>`;
            userList.appendChild(userItem);
        });

        // Append the list to the user list div
        userListDiv.innerHTML = '';
        userListDiv.appendChild(userList);

        // Event listener for "Assign Task" buttons
        const assignTaskButtons = document.querySelectorAll('.assignTaskButton');
        assignTaskButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                showAssignTaskForm(index);
            });
        });
    } else {
        userListDiv.innerHTML = 'No users found.';
    }
}


// Function to show the "Assign Task" form for a specific user to the admin
function showAssignTaskForm(index) {
    const assignTaskForm = document.querySelector(`#assignTaskForm${index}`);
    assignTaskForm.style.display = 'block';

    const assignTaskButton = assignTaskForm.querySelector('#assignTaskButton');
    assignTaskButton.addEventListener('click', function (e) {
        e.preventDefault();

        const taskName = document.querySelector(`#taskName${index}`).value;
        const taskTime = document.querySelector(`#taskTime${index}`).value;

        // Get the user data from local storage and add the task details
        const users = JSON.parse(localStorage.getItem('users'));
        users[index].taskName = taskName;
        users[index].taskTime = parseInt(taskTime, 10); // Convert to integer

        // Update the user data in local storage
        localStorage.setItem('users', JSON.stringify(users));

        // Clear the form fields and hide the form
        document.querySelector(`#taskName${index}`).value = '';
        document.querySelector(`#taskTime${index}`).value = '';
        assignTaskForm.style.display = 'none';
    });
}


// Function to start the countdown timer for tasks
function startTaskCountdown(user) {
    const taskListDiv = document.getElementById('taskList');
    const taskItem = document.createElement('p');

    // Create a timer element for the task
    const taskTimer = document.createElement('span');
    taskTimer.id = `taskTimer${user.id}`;
    taskTimer.className = 'timer';

    // Append the task item to the task list
    taskItem.innerHTML = `User: ${user.username}, Task: ${user.taskName}, Time Left: `;
    taskItem.appendChild(taskTimer);
    taskListDiv.appendChild(taskItem);

    // Function to update the countdown timer
    function updateTimer() {
        const timerElement = document.getElementById(`taskTimer${user.id}`);
        const remainingTime = user.taskTime * 60 - (Date.now() - user.startTime) / 1000;

        if (remainingTime <= 0) {
            timerElement.textContent = `Time's up!`;
        } else {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = Math.floor(remainingTime % 60);
            timerElement.textContent = `${minutes}m ${seconds}s`;
        }
    }

    // Initialize and start the countdown timer
    user.startTime = Date.now();
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    // Update the timer element as time passes
    setTimeout(() => {
        clearInterval(timerInterval);
        updateTimer();
    }, user.taskTime * 60 * 1000);
}


// Event listener for form submission
document.getElementById('userForm').addEventListener('submit', function (e) {
   alert("user created")
    e.preventDefault(); // Prevent the default form submission

    // Get the input values
    const newUsername = document.getElementById('newUsername').value;
    const newID = document.getElementById('newID').value;
    const newPassword = document.getElementById('newPassword').value;

    // Create an object to store user data
    const user = {
        username: newUsername,
        id: newID,
        password: newPassword,
        taskName: '',
        taskTime: 0,
        startTime: 0,
    };

    // Update the user data in local storage
    updateUserInStorage(user);

    //clear the form fields
    document.getElementById('newUsername').value = '';
    document.getElementById('newID').value = '';
    document.getElementById('newPassword').value = '';

            // Display the updated user data
            //displayUsers();
        });

        // Event listener for showing users
        document.getElementById('showUsersButton').addEventListener('click', function () {
            // Display user data
            displayUsers();
        });

        // Event listener for showing all tasks
        document.getElementById('showAllTasksButton').addEventListener('click', function () {
            displayAllTasks();
        });

        // Function to display all tasks
        function displayAllTasks() {
            const users = JSON.parse(localStorage.getItem('users'));
            const taskListDiv = document.getElementById('taskList');

            taskListDiv.innerHTML = ''; // Clear previous task list

            if (users && users.length > 0) {
                users.forEach(user => {
                    if (user.taskName && user.taskTime) {
                        // Start the countdown timer for each task
                        startTaskCountdown(user);
                    }
                });
            } else {
                taskListDiv.innerHTML = 'No tasks found.';
            }
        }

        

       

        



       //THIS PART NOT WORKING

 // Function to display task details for the logged-in user
        //  function displayUserTasks(username, password) {
        //     const taskDetailsDiv = document.getElementById('taskDetails');
        //     const loggedInUsername = document.getElementById('loggedInUsername');
        //     loggedInUsername.textContent = username;
        //     console.log(loggedInUsername);
        //     // Retrieve user data from local storage
        //     const users = JSON.parse(localStorage.getItem('users')) || [];

        //     // Find the logged-in user based on the username and password
        //     const user = users.find(u => u.username === username && u.password === password);
        //     if (user && user.taskName && user.taskTime) {
        //         // Create a task details section for the logged-in user
        //         const taskDetails = document.createElement('div');
        //         taskDetails.innerHTML = `<p>Task Name: ${user.taskName}</p>
        //             <p>Time Left: <span id="taskTimer">Calculating...</span></p>
        //             <input type="checkbox" id="taskCompleted"> Mark as Completed`;

        //         // Append the task details to the task details div
        //         taskDetailsDiv.innerHTML = '';
        //         taskDetailsDiv.appendChild(taskDetails);

        //         // Function to update the countdown timer
        //         function updateTimer() {
        //             const timerElement = document.getElementById('taskTimer');
        //             const remainingTime = user.taskTime * 60 - (Date.now() - user.startTime) / 1000;

        //             if (remainingTime <= 0) {
        //                 timerElement.textContent = "Time's up!";
        //             } else {
        //                 const minutes = Math.floor(remainingTime / 60);
        //                 const seconds = Math.floor(remainingTime % 60);
        //                 timerElement.textContent = `${minutes}m ${seconds}s`;
        //             }
        //         }
        //         // Initialize and start the countdown timer
        //         updateTimer();
        //         const timerInterval = setInterval(updateTimer, 1000);

        //         // Update the timer element as time passes
        //         setTimeout(() => {
        //             clearInterval(timerInterval);
        //             updateTimer();
        //         }, user.taskTime * 60 * 1000);

        //         // Event listener for marking the task as completed
        //         const taskCompleted = document.getElementById('taskCompleted');
        //         taskCompleted.addEventListener('change', function () {
        //             if (this.checked) {
        //               //
        //             }
        //         });
        //     } else {
        //         taskDetailsDiv.innerHTML = 'No tasks found for the logged-in user.';
        //     }
        // }
        
        
        
        

        