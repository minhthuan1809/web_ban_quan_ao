
interface FormErrors {
    name?: string;
    categoryId?: string;
    imageUrls?: string;
    materialId?: string;
    season?: string;
    jerseyType?: string;
    description?: string;
    price?: string;
    variants?: string;
}

export const validateForm = (form: any, setErrors: (errors: any) => void) => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên sản phẩm';
    }
    if (!form.categoryId) {
        newErrors.categoryId = 'Vui lòng chọn danh mục';
    }
    if (form.imageUrls.length === 0) {
        newErrors.imageUrls = 'Vui lòng thêm ít nhất 1 hình ảnh';
    }
    if (!form.materialId) {
        newErrors.materialId = 'Vui lòng chọn chất liệu';
    }
    if (!form.season.trim()) {
        newErrors.season = 'Vui lòng nhập mùa giải';
    }
    if (!form.jerseyType.trim()) {
        newErrors.jerseyType = 'Vui lòng nhập loại áo';
    }
    if (!form.description.trim()) {
        newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
    }
    if (form.price <= 0) {
        newErrors.price = 'Giá phải lớn hơn 0';
    }
    if (form.variants.length === 0) {
        newErrors.variants = 'Vui lòng thêm ít nhất 1 biến thể';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};