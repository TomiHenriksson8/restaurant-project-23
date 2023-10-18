import { fetchData } from "./functions";
import { UpdateResult } from "./interfaces/UpdateResult";
import { UploadResult } from "./interfaces/UploadResult";
import { LoginUser, UpdateUser, User, SignUpResult } from "./interfaces/User";
import { apiUrl, uploadUrl } from "./variables";

const profileModal = document.getElementById("profileModal") as HTMLDialogElement;
const userLink = document.querySelector(".user") as HTMLAnchorElement;

userLink.addEventListener("click", function(event) {
  event.preventDefault();
  profileModal.showModal();
});

profileModal.addEventListener("click", function(event) {
  if (event.target === profileModal) {
    profileModal.close();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && profileModal.open) {
    profileModal.close();
  }
});

const modalContent = document.querySelector(".modal-content");
modalContent?.addEventListener("click", function(event) {
  event.stopPropagation();
});

// select forms from the DOM
const loginForm = document.querySelector("#login-form");
const profileForm = document.querySelector("#profile-form");
const avatarForm = document.querySelector("#avatar-form");

// select inputs from the DOM
const usernameInput = document.querySelector(
  "#username"
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  "#password"
) as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  "#profile-username"
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  "#profile-email"
) as HTMLInputElement | null;

const avatarInput = document.querySelector(
  "#avatar"
) as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector("#username-target");
const emailTarget = document.querySelector("#email-target");
const avatarTarget = document.querySelector("#avatar-target");

// select signup elements from the DOM
const signUpForm = document.querySelector("#signUp-form");
const signUpUsernameInput = document.querySelector("#signUp-username") as HTMLInputElement | null;
const signUpPasswordInput = document.querySelector("#signUp-password") as HTMLInputElement | null;
const signUpEmailInput = document.querySelector("#signUp-email") as HTMLInputElement | null;

// TODO: function to login
const login = async (user: {
  username: string;
  password: string;
}): Promise<LoginUser> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };
  return await fetchData(apiUrl + "/auth/login", options);
};

// TODO function to updload avatar
const uploadAvatar = async (
  image: File,
  token: string
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("avatar", image);

  const options: RequestInit = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  };
  return await fetchData(apiUrl + "/users/avatar", options);
};

// TODO: function to update user data
const updateUserData = async (
  user: UpdateUser,
  token: string
): Promise<UpdateResult> => {
  const options: RequestInit = {
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
const addUserDataToDom = (user: User): void => {
  if (
    !usernameTarget ||
    !emailTarget ||
    !avatarTarget ||
    !profileEmailInput ||
    !profileUsernameInput
  ) {
    return;
  }
  usernameTarget.innerHTML = user.username;
  emailTarget.innerHTML = user.email;
  (avatarTarget as HTMLImageElement).src = uploadUrl + user.avatar;

  profileEmailInput.value = user.email;
  profileUsernameInput.value = user.username;
};

// function to get userdata from API using token
const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return await fetchData(apiUrl + "/users/token", options);
};

// TODO: function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {
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

  const editedUser: UpdateUser = {
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

const signUpModal = document.getElementById("signUpModal") as HTMLDialogElement;
document.getElementById("openSignUpModal")?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    if(profileModal && signUpModal) {
        profileModal.close();
        signUpModal.showModal();
    }
});

signUpModal?.addEventListener("click", (e: MouseEvent) => {
    if (e.target === signUpModal) signUpModal.close();
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && signUpModal.open) signUpModal.close();
});

// sign-up functionality

const signUp = async (user: {
  username: string;
  password: string;
  email: string;
}): Promise<SignUpResult> => {
  const options: RequestInit = {
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

  const feedbackModal = document.getElementById("feedbackModal") as HTMLDialogElement;
  feedbackModal.showModal();
});

const closeFeedbackModalButton = document.getElementById("closeFeedbackModal");

closeFeedbackModalButton?.addEventListener("click", () => {
    const feedbackModal = document.getElementById("feedbackModal") as HTMLDialogElement;
    feedbackModal.close();
});

// Logic to close the feedback modal by clicking outside.
const feedbackModal = document.getElementById("feedbackModal") as HTMLDialogElement;
feedbackModal?.addEventListener("click", (e: MouseEvent) => {
    if (e.target === feedbackModal) feedbackModal.close();
});

// Logic to close the feedback modal by pressing the "Escape" key.
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && feedbackModal.open) feedbackModal.close();
});




