import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="container mx-auto">
        <div className="px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white text-xl font-bold mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span>Vũng Áng Jobs</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Nền tảng tuyển dụng hàng đầu tại Vũng Áng, kết nối doanh nghiệp và ứng viên tài năng
                trong đa dạng các lĩnh vực.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Dành cho ứng viên</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to={ROUTES.JOBS}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Tìm việc làm
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.COMPANIES}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Danh sách công ty
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Hướng dẫn viết CV
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Nhà tuyển dụng</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to={ROUTES.POST_JOB}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Đăng tin tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.CANDIDATES}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Tìm ứng viên
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Bảng giá dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    Hỗ trợ tuyển dụng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Liên hệ</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 hover:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                  <span>contact@vungangjobs.vn</span>
                </li>
                <li className="flex items-start gap-3 hover:text-blue-400 transition-colors">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5 text-green-500" />
                  <span>1900 xxxx</span>
                </li>
                <li className="flex items-start gap-3 hover:text-blue-400 transition-colors">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <span>Tòa nhà FPT, Hà Nội, Việt Nam</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="px-4 border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Vũng Áng Jobs. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
