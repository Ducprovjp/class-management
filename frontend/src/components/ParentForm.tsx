import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/authHook';
import { AppErrorResponse } from '@/types/errors';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  phone?: string;
  email: string;
}

const ParentForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để tạo phụ huynh',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v2/parent', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response for /api/v2/parent:', response.data); // Debug API response
      toast({
        title: 'Thành công',
        description: `Tạo phụ huynh thành công: ${data.name}`,
      });
      reset();
    } catch (error) {
      const errorResponse = error instanceof Error && axios.isAxiosError(error) && error.response?.data
        ? (error.response.data as AppErrorResponse)
        : { error: 'Lỗi khi tạo phụ huynh', statusCode: 500 };
      console.error('API Error for /api/v2/parent:', errorResponse); // Debug API error
      toast({
        title: 'Lỗi',
        description: errorResponse.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo Phụ Huynh</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Label htmlFor="name" className="text-sm font-medium w-1/4 text-left">Họ và Tên</Label>
              <div className="w-3/4">
                <Input
                  id="name"
                  {...register('name', { required: 'Họ và tên là bắt buộc' })}
                  placeholder="Nhập họ và tên phụ huynh"
                  className="focus:ring-primary"
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="phone" className="text-sm font-medium w-1/4 text-left">Số Điện Thoại</Label>
              <div className="w-3/4">
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  className="focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="email" className="text-sm font-medium w-1/4 text-left">Email</Label>
              <div className="w-3/4">
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email là bắt buộc',
                    pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                  })}
                  placeholder="Nhập email phụ huynh"
                  className="focus:ring-primary"
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted"
            >
              {loading ? 'Đang Gửi...' : 'Gửi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentForm;