import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/authHook';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { login, token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      reset();
    } catch (err) {
      toast({
        title: 'Đăng nhập thất bại',
        description: err instanceof Error ? err.message : 'Đã có lỗi xảy ra',
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
          <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email là bắt buộc',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                })}
                placeholder="Nhập email của bạn"
                className="focus:ring-primary"
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Mật Khẩu</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Mật khẩu là bắt buộc',
                  minLength: { value: 6, message: 'Mật khẩu phải dài ít nhất 6 ký tự' }
                })}
                placeholder="Nhập mật khẩu"
                className="focus:ring-primary"
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted"
            >
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;