import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Parent } from "@/types/index";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ParentList: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để xem danh sách phụ huynh",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get<{ success: boolean; data: Parent[] }>(
          "http://localhost:8000/api/v2/parent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response for /api/v2/parent:", response.data); // Debug API response
        setParents(Array.isArray(response.data.data) ? response.data.data : []);
        toast({
          title: "Thành công",
          description: `Tải danh sách phụ huynh thành công (${response.data.data.length} phụ huynh)`,
        });
      } catch (error) {
        const errorResponse =
          error instanceof Error &&
          axios.isAxiosError(error) &&
          error.response?.data
            ? (error.response.data as AppErrorResponse)
            : { error: "Lỗi khi tải danh sách phụ huynh", statusCode: 500 };
        console.error("API Error for /api/v2/parent:", errorResponse);
        toast({
          title: "Lỗi",
          description: errorResponse.error,
          variant: "destructive",
        });
        setParents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, [token, toast]);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Danh Sách Phụ Huynh
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground mb-4">Đang tải...</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Họ và Tên</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">Số Điện Thoại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    Không có phụ huynh nào
                  </TableCell>
                </TableRow>
              )}
              {Array.isArray(parents) &&
                parents.map((parent) => (
                  <TableRow key={parent._id}>
                    <TableCell className="text-left">{parent.name}</TableCell>
                    <TableCell className="text-left">{parent.email}</TableCell>
                    <TableCell className="text-left">
                      {parent.phone || "N/A"}
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

export default ParentList;
