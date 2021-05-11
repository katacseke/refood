const formDataToObject = (formData) =>
  Object.entries(formData).reduce(
    (data, [key, value]) => ({ ...data, [key]: JSON.parse(value) }),
    {}
  );

export default formDataToObject;
