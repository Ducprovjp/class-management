import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authHook";
import { AppErrorResponse } from "@/types/errors";
import { Class } from "@/types/index";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  subject: string;
  day_of_week: string;
  time_start: string; // HH:mm
  time_end: string; // HH:mm
  teacher_name: string;
}

const ClassForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tạo lớp học",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post<{ success: boolean; data: Class }>(
        "http://localhost:8000/api/v2/class",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Thành công",
        description: `Tạo lớp học thành công: ${data.name}. ID: ${response.data.data._id}`,
      });
      reset();
      navigate("/classes");
    } catch (error) {
      const errorResponse =
        error instanceof Error &&
        axios.isAxiosError(error) &&
        error.response?.data
          ? (error.response.data as AppErrorResponse)
          : { error: "Lỗi khi tạo lớp học", statusCode: 500 };
      console.error("API Error for /api/v2/class:", errorResponse); // Debug API error
      toast({
        title: "Lỗi",
        description: errorResponse.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const days = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <div className="container mx-auto max-w-lg py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo Lớp Học</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên Lớp
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Tên lớp là bắt buộc" })}
                placeholder="Nhập tên lớp (ví dụ: Lớp Toán 10)"
                className="focus:ring-primary"
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Môn Học
              </Label>
              <Input
                id="subject"
                {...register("subject", { required: "Môn học là bắt buộc" })}
                placeholder="Nhập môn học (ví dụ: Toán)"
                className="focus:ring-primary"
              />
              {errors.subject && (
                <p className="text-destructive text-sm">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_of_week" className="text-sm font-medium">
                Ngày Trong Tuần
              </Label>
              <Select
                onValueChange={(value) => setValue("day_of_week", value)}
                {...register("day_of_week", {
                  required: "Ngày trong tuần là bắt buộc",
                })}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.day_of_week && (
                <p className="text-destructive text-sm">
                  {errors.day_of_week.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_start" className="text-sm font-medium">
                Giờ Bắt Đầu
              </Label>
              <Input
                id="time_start"
                type="time"
                step={900}
                {...register("time_start", {
                  required: "Giờ bắt đầu là bắt buộc",
                })}
                className="focus:ring-primary"
              />
              {errors.time_start && (
                <p className="text-destructive text-sm">
                  {errors.time_start.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_end" className="text-sm font-medium">
                Giờ Kết Thúc
              </Label>
              <Input
                id="time_end"
                type="time"
                step={900}
                {...register("time_end", {
                  required: "Giờ kết thúc là bắt buộc",
                })}
                className="focus:ring-primary"
              />
              {errors.time_end && (
                <p className="text-destructive text-sm">
                  {errors.time_end.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher_name" className="text-sm font-medium">
                Giáo Viên
              </Label>
              <Input
                id="teacher_name"
                {...register("teacher_name", {
                  required: "Tên giáo viên là bắt buộc",
                })}
                placeholder="Nhập tên giáo viên"
                className="focus:ring-primary"
              />
              {errors.teacher_name && (
                <p className="text-destructive text-sm">
                  {errors.teacher_name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted"
            >
              {loading ? "Đang Gửi..." : "Tạo Lớp"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassForm;
