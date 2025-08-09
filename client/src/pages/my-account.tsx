import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Key,
  Brain,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function MyAccount() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
      });
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving changes:", editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
      });
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Xin chào, {user.name}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Theo dõi tiến trình học tập và quản lý tài khoản của bạn
            </p>
          </div>

          {/* Writing Progress - Priority Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy size={24} className="text-teal-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      Tiến trình học
                    </span>
                  </div>
                  <Badge className="bg-teal-600 text-white px-3 py-1">
                    <Award size={14} className="mr-1" />
                    Level 5
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-teal-100">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen size={20} className="text-teal-600" />
                      <span className="text-2xl font-bold text-teal-700">
                        12
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Bài luận hoàn thành
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <Target size={20} className="text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-700">
                        8.5
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Điểm Writing trung bình
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp size={20} className="text-blue-600" />
                      <span className="text-2xl font-bold text-blue-700">
                        8,450
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng từ đã viết
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <Brain size={20} className="text-purple-600" />
                      <span className="text-2xl font-bold text-purple-700">
                        245
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Số từ mới đã học
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Thành tích gần đây
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-200"
                        >
                          Writing Task 2 IELTS
                        </Badge>
                        <span className="text-gray-600">Điểm: 8.0</span>
                        <span className="text-xs text-gray-500">
                          2 ngày trước
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className="text-blue-700 border-blue-200"
                        >
                          Writing Task 1 IELTS
                        </Badge>
                        <span className="text-gray-600">Điểm: 7.5</span>
                        <span className="text-xs text-gray-500">
                          5 ngày trước
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Thống kê học tập
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Tổng giờ học
                          </p>
                          <p className="text-lg font-bold text-blue-700">
                            47 giờ
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Calendar size={18} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Chuỗi ngày học
                          </p>
                          <p className="text-lg font-bold text-orange-700">
                            12 ngày
                          </p>
                          <p className="text-xs text-gray-500">
                            Kỷ lục: 28 ngày
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile and Settings Section - Single Card */}
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <User size={24} className="text-teal-700" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    Thông tin tài khoản
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <User size={20} className="text-teal-600" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Họ và tên
                      </Label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            id="name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="flex-1 border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-[56px] px-4"
                            placeholder="Nhập họ và tên"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={handleSave}
                              className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                              title="Lưu"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                              title="Hủy"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-900 font-medium relative flex items-center justify-between">
                          <span>{user.name}</span>
                          <button
                            onClick={handleEdit}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all duration-200"
                            title="Chỉnh sửa tên"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail size={16} />
                        Địa chỉ email
                      </Label>
                      <div className="border border-gray-200 rounded-lg p-4 text-gray-900 font-medium bg-[#ffffff]">
                        {user.email}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar size={16} />
                        Ngày tham gia
                      </Label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-900 font-medium">
                        {new Date(user.createAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Settings size={16} />
                        Gói đăng ký
                      </Label>
                      <div className="flex items-center">
                        <span className="inline-block px-3 py-1.5 border border-blue-200 rounded-md text-blue-700 text-sm font-medium pt-[11.4px] pb-[11.4px] mt-[0px] mb-[0px]">
                          Miễn phí
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Quick Actions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Settings size={20} className="text-teal-600" />
                    Cài đặt tài khoản
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="justify-start h-14 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Key size={18} className="text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Đổi mật khẩu</div>
                          <div className="text-xs text-blue-600">
                            Cập nhật bảo mật
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-14 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Mail size={18} className="text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Đổi email</div>
                          <div className="text-xs text-emerald-600">
                            Cập nhật địa chỉ email
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="justify-start h-14 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <LogOut size={18} className="text-red-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Đăng xuất</div>
                          <div className="text-xs text-red-600">
                            Thoát tài khoản
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
