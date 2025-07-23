import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/authHook';
import React from 'react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Hệ Thống Quản Lý Học Sinh</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p className="text-muted-foreground">
              Chào mừng, {user.name}! Quản lý học sinh, phụ huynh và lớp học của bạn.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Vui lòng đăng nhập hoặc đăng ký để quản lý học sinh, phụ huynh và lớp học.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;