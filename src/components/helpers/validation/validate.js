export const validateData = (data, props) => {
    data.forEach((item) => {
        if (typeof item !== "number" && isNaN(item)) {
            return "Chỉ nhận giá trị là số";
        }
    });
};
