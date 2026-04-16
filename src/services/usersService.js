import axios from "axios";

export const importUsersCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "/api/v1/users/bulk/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get("/api/v1/users/");
  return response.data;
};