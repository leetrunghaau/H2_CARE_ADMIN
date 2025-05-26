import { Input } from "antd";
import { useState } from "react";
const { Search } = Input;

const SearchComponent = (props) => {

    const {
        placeholder, onSearch
    } = props

    const [searchValue, setSearchValue] = useState('');
    let searchTimeout; // Định nghĩa biến bên ngoài    
        
    const handleSearchChange = (value) => {
        setSearchValue(value);
        
        // Hủy timeout trước đó nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Tạo timeout mới
        searchTimeout = setTimeout(() => {
            onSearch(value); // Gọi hàm tìm kiếm
        }, 300); // Độ trễ 300ms
    };
    

  return (
    <Search
        placeholder={placeholder}
        onSearch={onSearch} 
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onChange={(e) => handleSearchChange(e.target.value)} // Gọi hàm xử lý thay đổi
    />
  )
}
export default SearchComponent