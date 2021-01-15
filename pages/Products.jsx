import React from "react";
import Head from "next/head";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import { Layout } from "antd";
import { FromInstance } from "antd/lib/form";
import { Table, Tag, Space, Row, Col, Button, Modal, Form, Input } from "antd";
import ProductService from "../services/ProductService";
import { useEffect, useState } from "react";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const Product = () => {
  const [form] = Form.useForm();

  const productFromData = {
    product_name: "",
    product_detail: "",
    product_barcode: "",
    product_price: "",
    product_qty: "",
    product_image: "",
  };

  const [product, setproduct] = useState(productFromData);
  const [submit, setSubmit] = useState(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setproduct({ ...product, [name]: value });
    console.log("product :>> ", product);
  };

  const onSubmitProduct = () => {
    let data = {
      product_name: product.product_name,
      product_detail: product.product_detail,
      product_barcode: product.product_barcode,
      product_price: product.product_price,
      product_qty: product.product_qty,
      product_image: product.product_image,
    };
    console.log("data :>> ", data);
    setIsModalVisible(false); //Close modal
    ProductService.addNewProduct(data)
      .then((response) => {
        console.log("Check successfully := ", response);
        ProductService.getAllProduct().then((res) => {
          setDataShow(res.data);
          form.setFieldsValue(productFromData);
        });
      })
      .catch((e) => {
        console.log("Check error := ", e);
      });
  };

  const deleteProduct = (obj) => {
    console.log("Check obj data := ", obj);
    const status = confirm("Confirmed Delete ?");
    if (status) {
      ProductService.deleteProduct(obj.id)
        .then((response) => {
          console.log("Check delete successfully := ", response);
          ProductService.getAllProduct().then((res) => {
            setDataShow(res.data);
          });
        })
        .catch((e) => {
          console.log("Check error := ", e);
        });
    }
  };

  const [dataShow, setDataShow] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onSubmitProduct();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const retriveProduct = () => {
    ProductService.getAllProduct().then((res) => {
      console.log("res :>> ", res.data);
      setDataShow(res.data);
    });
  };

  useEffect(() => {
    retriveProduct();
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "product_image",
      key: "product_image",
      render: (url) => <img style={{ height: "10vh" }} src={url} />,
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Detail",
      dataIndex: "product_detail",
      key: "product_detail",
    },
    {
      title: "Barcode",
      dataIndex: "product_barcode",
      key: "product_barcode",
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (price) => (
        <a>
          {Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "EUR",
          }).format(price)}
        </a>
      ),
    },
    {
      title: "Qty",
      dataIndex: "product_qty",
      key: "product_qty",
    },
    {
      title: "Action",
      key: "action",
      render: (obj) => (
        <a onClick={() => deleteProduct(obj)}>
          <CloseOutlined />
        </a>
      ),
    },
  ];

  // const data = [
  //   {
  //     key: "1",
  //     name: "Pond",
  //     detail: "Pond 3310TI",
  //     barcode: "584696563310",
  //     price: "1500",
  //     qty: "1",
  //     image: "https://www.aquascapeinc.com/upload/Pond-Fish-Health-4.jpg",
  //   },
  // ];

  const onFinish = () => {};

  const onFinishFailed = () => {};
  return (
    <DefaultLayout>
      <Head>
        <title>Product</title>
      </Head>

      <Header className="site-layout-background">
        <Row>
          <Col span={12}>
            <div>Product</div>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={showModal}>
              Add
            </Button>
          </Col>
        </Row>
      </Header>

      <Content className="site-layout-background layout-content">
        <Table
          columns={columns}
          dataSource={dataShow}
          rowKey={(data) => data.id}
        />
        <Modal
          visible={isModalVisible}
          title="Add new product"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Submit
            </Button>,
          ]}
        >
          <Form
            form={form}
            {...layout}
            name="basic"
            initialValues={product}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="ชื่อสินค้า"
              name="product_name"
              rules={[
                { required: false, message: "Please input your product_name!" },
              ]}
            >
              <Input onChange={handleInputChange} name="product_name" />
            </Form.Item>

            <Form.Item
              label="รายละเอียดสินค้า"
              name="product_detail"
              rules={[
                {
                  required: false,
                  message: "Please input your product_detail!",
                },
              ]}
            >
              <Input onChange={handleInputChange} name="product_detail" />
            </Form.Item>

            <Form.Item
              label="บาร์โค้ด"
              name="product_barcode"
              rules={[
                {
                  required: false,
                  message: "Please input your product_barcode!",
                },
              ]}
            >
              <Input onChange={handleInputChange} name="product_barcode" />
            </Form.Item>

            <Form.Item
              label="ราคา"
              name="product_price"
              rules={[
                {
                  required: false,
                  message: "Please input your product_price!",
                },
              ]}
            >
              <Input onChange={handleInputChange} name="product_price" />
            </Form.Item>

            <Form.Item
              label="จำนวน"
              name="product_qty"
              rules={[
                { required: false, message: "Please input your product_qty!" },
              ]}
            >
              <Input onChange={handleInputChange} name="product_qty" />
            </Form.Item>

            <Form.Item
              label="URL รูปสินค้า"
              name="product_image"
              rules={[
                {
                  required: false,
                  message: "Please input your product_image!",
                },
              ]}
            >
              <Input onChange={handleInputChange} name="product_image" />
            </Form.Item>

            {/* <Form.Item >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item> */}
          </Form>
        </Modal>
      </Content>
    </DefaultLayout>
  );
};

export default Product;
