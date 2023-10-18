import { fetchData } from "./functions";
import { apiUrl, uploadUrl } from "./variables";
const profileModal = document.getElementById("profileModal");
const userLink = document.querySelector(".user");
userLink.addEventListener("click", function (event) {
    event.preventDefault();
    profileModal.showModal();
});
profileModal.addEventListener("click", function (event) {
    if (event.target === profileModal) {
        profileModal.close();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && profileModal.open) {
        profileModal.close();
    }
});
const modalContent = document.querySelector(".modal-content");
modalContent?.addEventListener("click", function (event) {
    event.stopPropagation();
});
// select forms from the DOM
const loginForm = document.querySelector("#login-form");
const profileForm = document.querySelector("#profile-form");
const avatarForm = document.querySelector("#avatar-form");
// select inputs from the DOM
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const profileUsernameInput = document.querySelector("#profile-username");
const profileEmailInput = document.querySelector("#profile-email");
const avatarInput = document.querySelector("#avatar");
// select profile elements from the DOM
const usernameTarget = document.querySelector("#username-target");
const emailTarget = document.querySelector("#email-target");
const avatarTarget = document.querySelector("#avatar-target");
// select signup elements from the DOM
const signUpForm = document.querySelector("#signUp-form");
const signUpUsernameInput = document.querySelector("#signUp-username");
const signUpPasswordInput = document.querySelector("#signUp-password");
const signUpEmailInput = document.querySelector("#signUp-email");
// TODO: function to login
const login = async (user) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    };
    return await fetchData(apiUrl + "/auth/login", options);
};
// TODO function to updload avatar
const uploadAvatar = async (image, token) => {
    const formData = new FormData();
    formData.append("avatar", image);
    const options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
        },
        body: formData,
    };
    return await fetchData(apiUrl + "/users/avatar", options);
};
// TODO: function to update user data
const updateUserData = async (user, token) => {
    const options = {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    };
    return await fetchData(apiUrl + "/users", options);
};
// TODO: function to add userdata (email, username and avatar image) to the
// Profile DOM and Edit Profile Form
const addUserDataToDom = (user) => {
    if (!usernameTarget ||
        !emailTarget ||
        !avatarTarget ||
        !profileEmailInput ||
        !profileUsernameInput) {
        return;
    }
    usernameTarget.innerHTML = user.username;
    emailTarget.innerHTML = user.email;
    avatarTarget.src = uploadUrl + user.avatar;
    profileEmailInput.value = user.email;
    profileUsernameInput.value = user.username;
};
// function to get userdata from API using token
const getUserData = async (token) => {
    const options = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };
    return await fetchData(apiUrl + "/users/token", options);
};
// TODO: function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    const userData = await getUserData(token);
    addUserDataToDom(userData);
};
// call checkToken on page load to check if token exists and update the DOM
checkToken();
// TODO: login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data
loginForm?.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (!usernameInput || !passwordInput) {
        return;
    }
    const user = {
        username: usernameInput.value,
        password: passwordInput.value,
    };
    const loginData = await login(user);
    console.log(loginData);
    localStorage.setItem("token", loginData.token);
    addUserDataToDom(loginData.data);
});
// TODO: profile form event listener
// event listener should call updateUserData function and update the DOM with
// the user data by calling addUserDataToDom or checkToken
profileForm?.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (!profileUsernameInput || !profileEmailInput) {
        return;
    }
    const editedUser = {
        username: profileUsernameInput.value,
        email: profileEmailInput.value,
    };
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    const userData = await updateUserData(editedUser, token);
    console.log(userData);
});
// TODO: avatar form event listener
// event listener should call uploadAvatar function and update the DOM with
// the user data by calling addUserDataToDom or checkToken
avatarForm?.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (!avatarInput?.files) {
        return;
    }
    const image = avatarInput.files[0];
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    const avatarData = await uploadAvatar(image, token);
    console.log(avatarData);
    checkToken();
});
const signUpModal = document.getElementById("signUpModal");
document.getElementById("openSignUpModal")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (profileModal && signUpModal) {
        profileModal.close();
        signUpModal.showModal();
    }
});
signUpModal?.addEventListener("click", (e) => {
    if (e.target === signUpModal)
        signUpModal.close();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && signUpModal.open)
        signUpModal.close();
});
// sign-up functionality
const signUp = async (user) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    };
    return await fetchData(apiUrl + "/users", options);
};
signUpForm?.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (!signUpUsernameInput || !signUpPasswordInput || !signUpEmailInput) {
        return;
    }
    const newUser = {
        username: signUpUsernameInput.value,
        password: signUpPasswordInput.value,
        email: signUpEmailInput.value,
    };
    const result = await signUp(newUser);
    console.log(result);
    const feedbackModal = document.getElementById("feedbackModal");
    feedbackModal.showModal();
});
const closeFeedbackModalButton = document.getElementById("closeFeedbackModal");
closeFeedbackModalButton?.addEventListener("click", () => {
    const feedbackModal = document.getElementById("feedbackModal");
    feedbackModal.close();
});
// Logic to close the feedback modal by clicking outside.
const feedbackModal = document.getElementById("feedbackModal");
feedbackModal?.addEventListener("click", (e) => {
    if (e.target === feedbackModal)
        feedbackModal.close();
});
// Logic to close the feedback modal by pressing the "Escape" key.
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && feedbackModal.open)
        feedbackModal.close();
});
