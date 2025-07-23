import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authHook";
import { AppErrorResponse } from "@/types/errors";
import { Class, Student } from "@/types/index";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface FormData {
  student_id: string;
  class_id: string;
}

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [token]);

  const fetchClasses = async (day = "") => {
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để xem danh sách lớp",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v2/class${day ? `?day=${day}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response for /api/v2/class:", response.data); // Debug API response
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setClasses(data);
      toast({
        title: "Thành công",
        description: `Tải danh sách lớp thành công (${data.length} lớp)`,
      });
    } catch (error) {
      const errorResponse =
        error instanceof Error &&
        axios.isAxiosError(error) &&
        error.response?.data
          ? (error.response.data as AppErrorResponse)
          : { error: "Lỗi khi tải danh sách lớp", statusCode: 500 };
      console.error("API Error for /api/v2/class:", errorResponse);
      toast({
        title: "Lỗi",
        description: errorResponse.error,
        variant: "destructive",
      });
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để xem danh sách học sinh",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await axios.get<{ success: boolean; data: Student[] }>(
        "http://localhost:8000/api/v2/student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response for /api/v2/student:", response.data); // Debug API response
      setStudents(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      const errorResponse =
        error instanceof Error &&
        axios.isAxiosError(error) &&
        error.response?.data
          ? (error.response.data as AppErrorResponse)
          : { error: "Lỗi khi tải danh sách học sinh", statusCode: 500 };
      console.error("API Error for /api/v2/student:", errorResponse);
      toast({
        title: "Lỗi",
        description: errorResponse.error,
        variant: "destructive",
      });
      setStudents([]);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để đăng ký lớp",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v2/class-registration/${data.class_id}/register`,
        { student_id: data.student_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Class Registration Response:", response.data); // Debug registration response
      toast({
        title: "Thành công",
        description: "Đăng ký lớp thành công",
      });
    } catch (error) {
      const errorResponse =
        error instanceof Error &&
        axios.isAxiosError(error) &&
        error.response?.data
          ? (error.response.data as AppErrorResponse)
          : { error: "Lỗi khi đăng ký lớp", statusCode: 500 };
      console.error("Class Registration Error:", errorResponse);
      toast({
        title: "Lỗi",
        description: errorResponse.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayFilter = (day: string) => {
    fetchClasses(day === "all" ? "" : day);
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
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Danh Sách Lớp Học
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Link to="/classes/new">
              <Button className="bg-primary hover:bg-primary/90">
                Tạo Lớp Học Mới
              </Button>
            </Link>
          </div>
          {loading && <p className="text-muted-foreground mb-4">Đang tải...</p>}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="day_filter" className="text-sm font-medium">
                Lọc Theo Ngày
              </Label>
              <Select onValueChange={handleDayFilter} defaultValue="all">
                <SelectTrigger id="day_filter" className="focus:ring-primary">
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các ngày</SelectItem>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="student_id" className="text-sm font-medium">
                  Học Sinh
                </Label>
                <Select
                  onValueChange={(value) => setValue("student_id", value)}
                  {...register("student_id", {
                    required: "Học sinh là bắt buộc",
                  })}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Chọn học sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.length === 0 ? (
                      <SelectItem value="no-students" disabled>
                        Không có học sinh nào
                      </SelectItem>
                    ) : (
                      students.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.student_id && (
                  <p className="text-destructive text-sm">
                    {errors.student_id.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class_id" className="text-sm font-medium">
                  Lớp Học
                </Label>
                <Select
                  onValueChange={(value) => setValue("class_id", value)}
                  {...register("class_id", { required: "Lớp học là bắt buộc" })}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length === 0 ? (
                      <SelectItem value="no-classes" disabled>
                        Không có lớp học nào
                      </SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.name} ({cls.subject})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.class_id && (
                  <p className="text-destructive text-sm">
                    {errors.class_id.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary hover:bg-primary/90 disabled:bg-muted"
              >
                {loading ? "Đang Đăng Ký..." : "Đăng Ký"}
              </Button>
            </form>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Tên Lớp</TableHead>
                <TableHead className="text-left">Môn Học</TableHead>
                <TableHead className="text-left">Ngày</TableHead>
                <TableHead className="text-left">Thời Gian</TableHead>
                <TableHead className="text-left">Giáo Viên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    Không có lớp học nào. Vui lòng tạo lớp học mới.
                  </TableCell>
                </TableRow>
              )}
              {Array.isArray(classes) &&
                classes.map((cls) => (
                  <TableRow key={cls._id}>
                    <TableCell className="text-left">{cls.name}</TableCell>
                    <TableCell className="text-left">
                      {cls.subject || "N/A"}
                    </TableCell>
                    <TableCell className="text-left">
                      {cls.day_of_week || "N/A"}
                    </TableCell>
                    <TableCell className="text-left">
                      {cls.time_start && cls.time_end
                        ? `${cls.time_start} - ${cls.time_end}`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-left">
                      {cls.teacher_name || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassList;
