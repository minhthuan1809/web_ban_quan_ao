// Import types from centralized location
import type { FormErrors } from '../../../../types/api';

// Local interface for product form validation
interface ProductFormErrors extends FormErrors {
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
}

export const validateForm = (form: any, setErrors: (errors: any) => void) => {
    const newErrors: ProductFormErrors = {};
    let missingFields: string[] = [];

    // Kiểm tra tên sản phẩm
    if (!form.name || !form.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên sản phẩm';
        missingFields.push('Tên sản phẩm');
    } else if (form.name.trim().length < 3) {
        newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
        missingFields.push('Tên sản phẩm (quá ngắn)');
    }

    // Kiểm tra danh mục
    if (!form.categoryId) {
        newErrors.categoryId = 'Vui lòng chọn danh mục';
        missingFields.push('Danh mục');
    }

    // Kiểm tra hình ảnh
    if (!form.imageUrls || form.imageUrls.length === 0) {
        newErrors.imageUrls = 'Vui lòng thêm ít nhất 1 hình ảnh';
        missingFields.push('Hình ảnh');
    }

    // Kiểm tra chất liệu
    if (!form.materialId) {
        newErrors.materialId = 'Vui lòng chọn chất liệu';
        missingFields.push('Chất liệu');
    }

    // Kiểm tra mùa giải
    if (!form.season || !form.season.trim()) {
        newErrors.season = 'Vui lòng nhập mùa giải';
        missingFields.push('Mùa giải');
    }

    // Kiểm tra loại áo
    if (!form.jerseyType || !form.jerseyType.trim()) {
        newErrors.jerseyType = 'Vui lòng nhập loại áo';
        missingFields.push('Loại áo');
    }

    // Kiểm tra mô tả
    if (!form.description || !form.description.trim()) {
        newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
        missingFields.push('Mô tả');
    } else if (form.description.trim().length < 10) {
        newErrors.description = 'Mô tả sản phẩm quá ngắn (ít nhất 10 ký tự)';
        missingFields.push('Mô tả (quá ngắn)');
    }

    // Giá mặc định là 1, không cần kiểm tra
    
    // Kiểm tra trạng thái
    if (!form.status) {
        newErrors.status = 'Vui lòng chọn trạng thái';
        missingFields.push('Trạng thái');
    }
    
    // Kiểm tra giá khuyến mãi
    if (form.salePrice < 0) {
        newErrors.salePrice = 'Giá khuyến mãi không được nhỏ hơn 0';
        missingFields.push('Giá khuyến mãi');
    }
    
    // Kiểm tra biến thể sản phẩm
    if (!form.variants || form.variants.length === 0) {
        newErrors.variants = 'Vui lòng thêm ít nhất một biến thể sản phẩm';
        missingFields.push('Biến thể sản phẩm');
    } else {
        // Kiểm tra chi tiết từng biến thể
        const variantMap = new Map();
        let invalidVariant = false;

        for (let i = 0; i < form.variants.length; i++) {
            const variant = form.variants[i];
            
            // Kiểm tra size
            if (!variant.size) {
                newErrors.variants = `Biến thể #${i+1}: Thiếu kích cỡ`;
                missingFields.push(`Biến thể #${i+1}: Kích cỡ`);
                invalidVariant = true;
                break;
            }
            
            // Kiểm tra màu sắc
            if (!variant.color || !Array.isArray(variant.color) || variant.color.length === 0) {
                newErrors.variants = `Biến thể #${i+1}: Thiếu màu sắc`;
                missingFields.push(`Biến thể #${i+1}: Màu sắc`);
                invalidVariant = true;
                break;
            }
            
            // Kiểm tra số lượng
            if (variant.stockQuantity <= 0) {
                newErrors.variants = `Biến thể #${i+1}: Số lượng phải lớn hơn 0`;
                missingFields.push(`Biến thể #${i+1}: Số lượng`);
                invalidVariant = true;
                break;
            }
            
            // Kiểm tra điều chỉnh giá
            if (variant.priceAdjustment < 0) {
                newErrors.variants = `Biến thể #${i+1}: Giá điều chỉnh không được âm`;
                missingFields.push(`Biến thể #${i+1}: Giá điều chỉnh`);
                invalidVariant = true;
                break;
            }
            
            // Kiểm tra trùng lặp
            if (!invalidVariant) {
                const key = `${variant.size}-${variant.color[0]}`;
                
                if (variantMap.has(key)) {
                    newErrors.variants = `Biến thể có size ${variant.size} và màu ${variant.color[0]} đã tồn tại`;
                    missingFields.push('Biến thể trùng lặp');
                    break;
                }
                
                variantMap.set(key, true);
            }
        }
    }

    setErrors(newErrors);

    // Trả về thông tin chi tiết về lỗi
    if (missingFields.length > 0) {
        console.error('Thiếu các trường: ' + missingFields.join(', '));
    }
    
    return Object.keys(newErrors).length === 0;
};