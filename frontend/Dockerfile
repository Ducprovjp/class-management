# Sử dụng image Node.js chính thức
FROM node:20-alpine

# Cài đặt Yarn
RUN apk add --no-cache yarn

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt dependencies với Yarn
RUN yarn install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN yarn build

# Cài đặt server để phục vụ file tĩnh
RUN yarn global add serve

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng với serve
CMD ["serve", "-s", "dist", "-l", "3000"]