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

# Build TypeScript (nếu có tsconfig.json)
RUN yarn build

# Mở cổng 8000
EXPOSE 8000

# Lệnh chạy ứng dụng
CMD ["yarn", "start"]