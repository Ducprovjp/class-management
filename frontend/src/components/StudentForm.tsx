import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/authHook';
import { AppErrorResponse } from '@/types/errors';
import { Parent, Student } from '@/types/index';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  date_of_birth: string;
  gender: string;
  parent_id: string;
}

const StudentForm: React.FC = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchParents = async () => {
      if (!token) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng đăng nhập để lấy danh sách phụ huynh',
          variant: 'destructive',
        });
        return;
      }
      try {
        const response = await axios.get<{ success: boolean; data: Parent[] }>('http://localhost:8000/api/v2/parent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response for /api/v2/parent:', response.data); // Debug API response
        setParents(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        const errorResponse = error instanceof Error && axios.isAxiosError(error) && error.response?.data
          ? (error.response.data as AppErrorResponse)
          : { error: 'Lỗi khi tải danh sách phụ huynh', statusCode: 500 };
        console.error('API Error for /api/v2/parent:', errorResponse);
        toast({
          title: 'Lỗi',
          description: errorResponse.error,
          variant: 'destructive',
        });
        setParents([]);
      }
    };
    fetchParents();
  }, [token, toast]);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để tạo học sinh',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post<{ success: boolean; data: Student }>('http://localhost:8000/api/v2/student', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response for /api/v2/student:', response.data); // Debug API response
      toast({
        title: 'Thành công',
        description: `Tạo học sinh thành công: ${data.name}. ID: ${response.data.data._id}`,
      });
      reset();
      setSelectedDate(undefined);
    } catch (error) {
      const errorResponse = error instanceof Error && axios.isAxiosError(error) && error.response?.data
        ? (error.response.data as AppErrorResponse)
        : { error: 'Lỗi khi tạo học sinh', statusCode: 500 };
      console.error('API Error for /api/v2/student:', errorResponse);
      toast({
        title: 'Lỗi',
        description: errorResponse.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('date_of_birth', format(date, 'yyyy-MM-dd'));
    } else {
      setValue('date_of_birth', '');
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo Học Sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Label htmlFor="name" className="text-sm font-medium w-1/4 text-left">Họ và Tên</Label>
              <div className="w-3/4">
                <Input
                  id="name"
                  {...register('name', { required: 'Họ và tên là bắt buộc' })}
                  placeholder="Nhập họ và tên học sinh"
                  className="focus:ring-primary"
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="date_of_birth" className="text-sm font-medium w-1/4 text-left">Ngày Sinh</Label>
              <div className="w-3/4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!selectedDate && 'text-muted-foreground'}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: vi }) : <span>Chọn ngày sinh</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={vi}
                      initialFocus
                      className="bg-white text-black"
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  id="date_of_birth"
                  type="hidden"
                  {...register('date_of_birth', { required: 'Ngày sinh là bắt buộc' })}
                />
                {errors.date_of_birth && <p className="text-destructive text-sm">{errors.date_of_birth.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="gender" className="text-sm font-medium w-1/4 text-left">Giới Tính</Label>
              <div className="w-3/4">
                <Select
                  onValueChange={(value) => setValue('gender', value)}
                  {...register('gender', { required: 'Giới tính là bắt buộc' })}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="parent_id" className="text-sm font-medium w-1/4 text-left">Phụ Huynh</Label>
              <div className="w-3/4">
                <Select
                  onValueChange={(value) => setValue('parent_id', value)}
                  {...register('parent_id', { required: 'Phụ huynh là bắt buộc' })}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Chọn phụ huynh" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.length === 0 ? (
                      <SelectItem value="no-parents" disabled>
                        Không có phụ huynh nào
                      </SelectItem>
                    ) : (
                      parents.map((parent) => (
                        <SelectItem key={parent._id} value={parent._id}>
                          {parent.name} ({parent.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.parent_id && <p className="text-destructive text-sm">{errors.parent_id.message}</p>}
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

export default StudentForm;