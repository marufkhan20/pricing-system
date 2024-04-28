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

// delete product
const deleteProduct = async (button) => {
  try {
    const id = button.getAttribute("data");

    if (id) {
      await fetch(`/products/${id}`, { method: "DELETE" });
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

// delete order
const deleteOrder = async (button) => {
  try {
    const id = button.getAttribute("data");

    if (id) {
      await fetch(`/order/${id}`, { method: "DELETE" });
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

// get customer data
const getCustomerInfo = async (select) => {
  try {
    // get all inputs
    const freightRate = document.querySelector('input[name="freightRate"]');
    const commission1 = document.querySelector('input[name="commission1"]');
    const commission2 = document.querySelector('input[name="commission2"]');
    const markUp = document.querySelector('input[name="markUp"]');

    const id = select?.value;

    const res = await fetch(`/customers/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    const customer = data?.customer;

    if (customer) {
      freightRate.value = customer?.freightRate;
      commission1.value = customer?.commission1;
      commission2.value = customer?.commission2;
      markUp.value = customer?.markUp;
    } else {
      alert("No customer information available.");
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
