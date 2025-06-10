interface FormErrors {
    name?: string;
    categoryId?: string;
    imageUrls?: string;
    materialId?: string;
    season?: string;
    jerseyType?: string;
    description?: string;
    price?: string;
    status?: string;
    salePrice?: string;
    variants?: string;
    size?: string;
    color?: string;
}

export const validateForm = (form: any, setErrors: (errors: any) => void) => {
    const newErrors: FormErrors = {};
    let missingFields: string[] = [];

    if (!form.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên sản phẩm';
        missingFields.push('Tên sản phẩm');
    }
    if (!form.categoryId) {
        newErrors.categoryId = 'Vui lòng chọn danh mục';
        missingFields.push('Danh mục');
    }
    if (form.imageUrls.length === 0) {
        newErrors.imageUrls = 'Vui lòng thêm ít nhất 1 hình ảnh';
        missingFields.push('Hình ảnh');
    }
    if (!form.materialId) {
        newErrors.materialId = 'Vui lòng chọn chất liệu';
        missingFields.push('Chất liệu');
    }
    if (!form.season.trim()) {
        newErrors.season = 'Vui lòng nhập mùa giải';
        missingFields.push('Mùa giải');
    }
    if (!form.jerseyType.trim()) {
        newErrors.jerseyType = 'Vui lòng nhập loại áo';
        missingFields.push('Loại áo');
    }
    if (!form.description.trim()) {
        newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
        missingFields.push('Mô tả');
    }
    if (form.price <= 0) {
        newErrors.price = 'Giá phải lớn hơn 0';
        missingFields.push('Giá');
    }
    
    if (!form.status) {
        newErrors.status = 'Vui lòng chọn trạng thái';
        missingFields.push('Trạng thái');
    }
    
    if (form.salePrice < 0) {
        newErrors.salePrice = 'Giá khuyến mãi không được nhỏ hơn 0';
        missingFields.push('Giá khuyến mãi');
    }
    
    // Kiểm tra size và color thay vì variants
    if (!form.size) {
        newErrors.size = 'Vui lòng chọn kích thước';
        missingFields.push('Kích thước');
    }
    
    if (!form.color || form.color.length === 0) {
        newErrors.color = 'Vui lòng chọn ít nhất một màu sắc';
        missingFields.push('Màu sắc');
    }

    setErrors(newErrors);

    // Trả về thông tin chi tiết về lỗi
    if (missingFields.length > 0) {
        console.error('Thiếu các trường: ' + missingFields.join(', '));
    }
    
    return Object.keys(newErrors).length === 0;
};