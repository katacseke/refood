const objectToFormData = (data) =>
  Object.entries(data).reduce((formData, [key, value]) => {
    if (value instanceof FileList) {
      formData.append(key, value[0]);
    } else {
      formData.append(key, JSON.stringify(value));
    }

    return formData;
  }, new FormData());

export default objectToFormData;
