import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Divider,
  List,
  Image,
  Modal,
  InputNumber,
  Form,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const { Title, Text } = Typography;

const CartComponent = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  // Lấy giỏ hàng từ localStorage khi load trang
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  // Lưu giỏ hàng vào localStorage
  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Xử lý khi nhấn Thanh Toán
  const handleCheckout = () => {
    if (cart.length === 0) {
      message.error('Giỏ hàng của bạn đang trống!');
      return;
    }
    navigate('/checkout'); // Điều hướng sang trang thanh toán
  };

  // Cập nhật số lượng sản phẩm
  const handleSaveQuantity = ({ quantity }) => {
    if (editingItem) {
      const updatedCart = cart.map((item) =>
        item.id === editingItem.id ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
      message.success('Cập nhật số lượng thành công!');
      setShowModal(false);
      setEditingItem(null);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
    message.success('Xóa sản phẩm thành công!');
  };

  // Mở modal để chỉnh sửa số lượng sản phẩm
  const handleEditQuantity = (item) => {
    form.setFieldsValue({ quantity: item.quantity });
    setEditingItem(item);
    setShowModal(true);
  };

  // Đóng modal và reset form
  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditingItem(null);
  };

  return (
    <div>
      <HeaderComponent
        
      />
      {/* Nội dung của trang */}
      <div>
      <Row justify="center" style={{ padding: '20px' }}>
      <Col span={16}>
        <Card>
          <Title level={2}>Giỏ hàng</Title>
          <Divider />
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => handleEditQuantity(item)}>
                    Chỉnh sửa số lượng
                  </Button>,
                  <Button type="link" danger onClick={() => handleDeleteProduct(item.id)}>
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Image src={`http://localhost:8000/storage${item.image_url}`} width={50} />}
                  title={item.name}
                  description={`Số lượng: ${item.quantity} - Giá: ${item.price}đ`}
                />
              </List.Item>
            )}
          />
          <Divider />
          <Text strong>
            Tổng tiền:{' '}
            {cart.reduce((total, item) => total + item.price * item.quantity, 0)}đ
          </Text>
          <Button type="primary" style={{ marginTop: '20px',marginLeft : '20px' }} onClick={handleCheckout}>
            Thanh Toán
          </Button>
        </Card>
      </Col>

      {/* Modal Chỉnh sửa số lượng */}
      <Modal
        title="Chỉnh sửa số lượng"
        visible={showModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveQuantity}>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Số lượng là bắt buộc!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </Row>
      </div>
    </div>
  );

  
};

export default CartComponent;
