// toggle profile menu
const toggleProfileMenu = () => {
  const profileMenu = document.getElementById("profile-menu");

  if (!profileMenu?.classList.contains("hidden")) {
    profileMenu.classList.add("hidden");
  } else {
    profileMenu.classList.remove("hidden");
  }
};

// delete customer
const deleteCustomer = async (button) => {
  try {
    const id = button.getAttribute("data");

    if (id) {
      await fetch(`/customers/${id}`, { method: "DELETE" });
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

// logout
const logout = async () => {
  try {
    await fetch(`/logout`);
    location.reload();
  } catch (error) {
    console.error(error);
  }
};
