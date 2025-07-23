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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authHook";
import { Student, Subscription } from "@/types/index";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Danh sách gói học mẫu
const PACKAGE_LIST = [
  { name: "Gói 4 buổi", total_sessions: 4 },
  { name: "Gói 8 buổi", total_sessions: 8 },
  { name: "Gói 12 buổi", total_sessions: 12 },
  { name: "Gói 16 buổi", total_sessions: 16 },
];

interface FormData {
  student_id: string;
  package_name: string;
  total_sessions: number;
  start_date?: string;
  end_date?: string;
}

const SubscriptionManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentSubscriptions, setStudentSubscriptions] = useState<
    Subscription[]
  >([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>("");
  const [subscriptionDetail, setSubscriptionDetail] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Lấy danh sách học sinh
  useEffect(() => {
    if (token) fetchStudents();
  }, [token]);

  // Lấy danh sách subscription của học sinh khi chọn học sinh
  useEffect(() => {
    if (selectedStudent && token) fetchStudentSubscriptions(selectedStudent);
    setSelectedSubscriptionId("");
    setSubscriptionDetail(null);
  }, [selectedStudent, token]);

  // Lấy chi tiết subscription khi chọn
  useEffect(() => {
    if (selectedSubscriptionId && token)
      fetchSubscriptionDetail(selectedSubscriptionId);
    else setSubscriptionDetail(null);
  }, [selectedSubscriptionId, token]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get<{ success: boolean; data: Student[] }>(
        "http://localhost:8000/api/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.data);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách học sinh",
        variant: "destructive",
      });
    }
  };

  // Lấy danh sách subscription của học sinh
  const fetchStudentSubscriptions = async (student_id: string) => {
    setStudentSubscriptions([]);
    setSubscriptionDetail(null);
    setSelectedSubscriptionId("");
    setLoading(true);
    try {
      const response = await axios.get<{
        success: boolean;
        data: Subscription[];
      }>(
        `http://localhost:8000/api/subscriptions/student/${student_id}/subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudentSubscriptions(response.data.data);
    } catch {
      setStudentSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết 1 subscription
  const fetchSubscriptionDetail = async (subscription_id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<{
        success: boolean;
        data: Subscription;
      }>(`http://localhost:8000/api/subscriptions/${subscription_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptionDetail(response.data.data);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin gói học",
        variant: "destructive",
      });
      setSubscriptionDetail(null);
    } finally {
      setLoading(false);
    }
  };

  // Tạo gói học mới
  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setLoading(true);
    try {
      await axios.post<{ success: boolean; data: Subscription }>(
        "http://localhost:8000/api/subscriptions",
        {
          student_id: data.student_id,
          package_name: data.package_name,
          total_sessions: data.total_sessions,
          start_date: data.start_date,
          end_date: data.end_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Thành công", description: "Tạo gói học thành công" });
      // Sau khi tạo, reload danh sách subscription
      fetchStudentSubscriptions(data.student_id);
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Không thể tạo gói học";
      toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Trừ buổi
  const handleUseSession = async () => {
    if (!token || !subscriptionDetail) return;
    setLoading(true);
    try {
      const response = await axios.patch<{
        success: boolean;
        data: Subscription;
      }>(
        `http://localhost:8000/api/subscriptions/${subscriptionDetail._id}/use`,
        { student_id: subscriptionDetail.student_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Thành công", description: "Đã trừ 1 buổi" });
      setSubscriptionDetail(response.data.data);
      // Cập nhật lại danh sách subscription
      fetchStudentSubscriptions(subscriptionDetail.student_id);
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Không thể trừ buổi";
      toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quản Lý Gói Học</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chọn học sinh */}
          <div className="mb-4">
            <Label htmlFor="student_id">Chọn học sinh</Label>
            <Select
              onValueChange={(value) => {
                setSelectedStudent(value);
                setValue("student_id", value);
              }}
              value={selectedStudent}
            >
              <SelectTrigger className="focus:ring-primary">
                <SelectValue placeholder="Chọn học sinh" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(students) && students.length === 0 ? (
                  <SelectItem value="no-students" disabled>
                    Không có học sinh nào
                  </SelectItem>
                ) : (
                  Array.isArray(students) &&
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

          {/* Form tạo gói học */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mb-6">
            <div className="grid gap-2">
              <Label htmlFor="package_name">Chọn gói học</Label>
              <Select
                onValueChange={(value) => {
                  setValue("package_name", value);
                  const pkg = PACKAGE_LIST.find((p) => p.name === value);
                  if (pkg) setValue("total_sessions", pkg.total_sessions);
                }}
                {...register("package_name", {
                  required: "Gói học là bắt buộc",
                })}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue placeholder="Chọn gói học" />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_LIST.map((pkg) => (
                    <SelectItem key={pkg.name} value={pkg.name}>
                      {pkg.name} ({pkg.total_sessions} buổi)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.package_name && (
                <p className="text-destructive text-sm">
                  {errors.package_name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !selectedStudent}
              variant="outline"
            >
              {loading ? "Đang tạo..." : "Tạo gói học"}
            </Button>
          </form>

          {/* Chọn gói học đã tạo (nếu có nhiều gói) */}
          {Array.isArray(studentSubscriptions) &&
            studentSubscriptions.length > 0 && (
              <div className="mb-4">
                <Label>Chọn gói học đã tạo</Label>
                <Select
                  onValueChange={(value) => setSelectedSubscriptionId(value)}
                  value={selectedSubscriptionId}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Chọn gói học" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentSubscriptions.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.package_name} ({sub.used_sessions}/
                        {sub.total_sessions} buổi)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Trạng thái gói học */}
          {subscriptionDetail && (
            <div className="mb-6">
              <Label>Trạng thái gói học</Label>
              <div className="border rounded p-4 mt-2">
                <p>
                  <b>Gói:</b> {subscriptionDetail.package_name}
                </p>
                <p>
                  <b>Tổng buổi:</b> {subscriptionDetail.total_sessions}
                </p>
                <p>
                  <b>Đã dùng:</b> {subscriptionDetail.used_sessions}
                </p>
                <p>
                  <b>Còn lại:</b>{" "}
                  {(subscriptionDetail.total_sessions || 0) -
                    (subscriptionDetail.used_sessions || 0)}
                </p>
                <Button
                  onClick={handleUseSession}
                  disabled={
                    loading ||
                    subscriptionDetail.used_sessions >=
                      (subscriptionDetail.total_sessions || 0)
                  }
                  className="mt-2 bg-primary hover:bg-primary/90 disabled:bg-muted"
                >
                  {loading ? "Đang trừ..." : "Dùng 1 buổi"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
