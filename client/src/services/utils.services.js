export default {
  extractErrors: function (validationResult, fieldName) {
    if (!validationResult.error) return;

    const errors = {};

    validationResult.error.details.forEach((err) => {
      const key = fieldName || err.context.key;
      let value = err.message;
      if (err.type === "string.pattern.base")
        value = `provided "${err.context.label}" is invalid`;

      if (err.type === "string.empty")
        value = `"${err.context.label}" is required`;

      if (err.type === "any.only") {
        console.log(err);
        value = `"${err.context.label}" does not match "${err.context.valids[0].key}"`;
      }

      if (err.type === "any.custom") value = err.context.error.message;

      errors[key] = value;
    });

    return errors;
  },

  validateImage: function (size) {
    return function (img, helpers) {
      if (!img) return img;

      const imgNameRegex = /^[a-z0-9_]{1,50}\.(jpe?g|png|gif)/i;
      const imgTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!img.name.match(imgNameRegex)) throw new Error("invalid image name.");

      if (!imgTypes.includes(img.type)) throw new Error("invalid image type.");

      if (img.size > size) throw new Error("invalid image size");

      return img;
    };
  },
};
