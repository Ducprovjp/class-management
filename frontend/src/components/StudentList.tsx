import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Class, Parent, Student } from "@/types/index";
import axios from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useEffect, useState } from "react";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentClasses, setStudentClasses] = useState<Class[]>([]);
  const [parentInfo, setParentInfo] = useState<Parent | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để xem danh sách học sinh",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get<{ success: boolean; data: Student[] }>(
          "http://localhost:8000/api/student",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response for /api/student:", response.data); // Debug API response
        setStudents(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        toast({
          title: "Thành công",
          description: `Tải danh sách học sinh thành công (${response.data.data.length} học sinh)`,
        });
      } catch (error) {
        const errorResponse =
          error instanceof Error &&
          axios.isAxiosError(error) &&
          error.response?.data
            ? (error.response.data as AppErrorResponse)
            : { error: "Lỗi khi tải danh sách học sinh", statusCode: 500 };
        console.error("API Error for /api/student:", errorResponse);
        toast({
          title: "Lỗi",
          description: errorResponse.error,
          variant: "destructive",
        });
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token, toast]);

  const handleViewDetail = async (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
    // Lấy thông tin parent
    if (typeof student.parent_id === "string") {
      try {
        const response = await axios.get<{ success: boolean; data: Parent }>(
          `http://localhost:8000/api/parent/${student.parent_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParentInfo(response.data.data);
      } catch {
        setParentInfo(null);
      }
    } else {
      setParentInfo(student.parent_id as Parent);
    }
    // Lấy các lớp đã đăng ký
    try {
      // Lấy danh sách đăng ký lớp của học sinh
      const regRes = await axios.get<{ success: boolean; data: any[] }>(
        `http://localhost:8000/api/class-registration/student/${student._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const classIds = regRes.data.data.map((reg) => reg.class_id);
      // Lấy thông tin chi tiết các lớp đã đăng ký
      if (classIds.length > 0) {
        const classRes = await axios.get<{ success: boolean; data: Class[] }>(
          `http://localhost:8000/api/class`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudentClasses(
          classRes.data.data.filter((cls) => classIds.includes(cls._id))
        );
      } else {
        setStudentClasses([]);
      }
    } catch {
      setStudentClasses([]);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Danh Sách Học Sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground mb-4">Đang tải...</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Họ và Tên</TableHead>
                <TableHead className="text-left">Ngày Sinh</TableHead>
                <TableHead className="text-left">Giới Tính</TableHead>
                <TableHead className="text-left">Lớp Hiện Tại</TableHead>
                <TableHead className="text-left">ID Phụ Huynh</TableHead>
                <TableHead className="text-left">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    Không có học sinh nào
                  </TableCell>
                </TableRow>
              )}
              {Array.isArray(students) &&
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="text-left">{student.name}</TableCell>
                    <TableCell className="text-left">
                      {student.dob
                        ? format(new Date(student.dob), "PPP", { locale: vi })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-left">
                      {student.gender}
                    </TableCell>
                    <TableCell className="text-left">
                      {student.current_grade || "N/A"}
                    </TableCell>
                    <TableCell className="text-left">
                      {typeof student.parent_id === "string"
                        ? student.parent_id
                        : (student.parent_id as Parent).name}
                    </TableCell>
                    <TableCell className="text-left">
                      <Dialog
                        open={
                          dialogOpen && selectedStudent?._id === student._id
                        }
                        onOpenChange={setDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="bg-primary text-white px-3 py-1 rounded"
                            onClick={() => handleViewDetail(student)}
                          >
                            Xem chi tiết
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thông tin học sinh</DialogTitle>
                          </DialogHeader>
                          {selectedStudent && (
                            <div className="space-y-2">
                              <div>
                                <b>Họ và tên:</b> {selectedStudent.name}
                              </div>
                              <div>
                                <b>Ngày sinh:</b>{" "}
                                {selectedStudent.dob
                                  ? format(
                                      new Date(selectedStudent.dob),
                                      "PPP",
                                      { locale: vi }
                                    )
                                  : "N/A"}
                              </div>
                              <div>
                                <b>Giới tính:</b> {selectedStudent.gender}
                              </div>
                              <div>
                                <b>Lớp hiện tại:</b>{" "}
                                {selectedStudent.current_grade || "N/A"}
                              </div>
                              <div>
                                <b>Phụ huynh:</b>{" "}
                                {parentInfo
                                  ? `${parentInfo.name} (${parentInfo.email}, ${
                                      parentInfo.phone || "N/A"
                                    })`
                                  : "N/A"}
                              </div>
                              <div>
                                <b>Các lớp đã đăng ký:</b>
                                <ul className="list-disc ml-5">
                                  {studentClasses.length === 0 ? (
                                    <li>Chưa đăng ký lớp nào</li>
                                  ) : (
                                    studentClasses.map((cls) => (
                                      <li key={cls._id}>
                                        {cls.name} ({cls.day_of_week},{" "}
                                        {cls.time_start} - {cls.time_end})
                                      </li>
                                    ))
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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

export default StudentList;
