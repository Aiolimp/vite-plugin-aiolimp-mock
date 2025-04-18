export const get = () => {
  return {
    code: 0,
    data: {
      name: '张三',
      age: 28,
    },
  };
};

export const post = (req: any) => {
  return {
    code: 0,
    message: '用户创建成功',
  };
};
