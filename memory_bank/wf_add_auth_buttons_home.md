## Current tasks from user prompt
- Them button o man hinh de co the dang nhap va dang ki.
- Them hot reload khi thay doi code.
- Fix loi dang nhap bi chuyen den `/unauthorized`.
- An nut dang nhap/dang ky khi da dang nhap.
- Chi hien thi nut dang nhap/dang ky o nav bar.
- Fix loi tao bai viet khong hoat dong.
- Fix thong bao loi tao bai viet that bai.

## Plan (simple)
- Xac dinh man hinh trang chu dang hien thi cho nguoi dung.
- Them 2 nut dieu huong den `/login` va `/register`.
- Kiem tra lint co loi phat sinh khong.
- Kiem tra script dev va bat co che watch polling de hot reload on dinh hon.
- Kiem tra luong auth va middleware sau dang nhap.
- Dieu kien hien thi nut auth tren home theo session.
- Xoa nut auth khoi hero o home, de nav bar la noi duy nhat hien thi.
- Kiem tra luong tao bai viet tu form admin den API.
- Tra ve message loi chi tiet tu API tao bai viet va hien thi tren UI.

## Steps
- Doc file `apps/web/app/page.tsx`.
- Chen `Link` va 2 nut auth vao phan hero.
- Chay kiem tra lint cho file vua sua.
- Cap nhat trang thai cong viec.
- Sua `apps/web/package.json` script `dev` de bat polling.
- Sua redirect sau login theo role.
- Dieu chinh middleware de tranh verify JWT o Edge.
- Sua `apps/web/app/page.tsx` de chi hien thi nut login/register neu chua co session.
- Xoa hoan toan nut login/register khoi `apps/web/app/page.tsx`.
- Sua `apps/web/app/admin/posts/new/page.tsx` de submit API tao bai viet.
- Sua API `apps/web/app/api/admin/posts/route.ts` de phan loai loi `403/409/500`.
- Cap nhat UI `apps/web/app/admin/posts/new/page.tsx` hien message loi chi tiet va validate co ban.

## Things done
- Da tao file workflow de theo doi task.
- Da them nut `Dang nhap` va `Dang ky` tai `apps/web/app/page.tsx`.
- Da kiem tra lint cho file vua sua.
- Da bat `WATCHPACK_POLLING=true` trong script `dev` de hot reload bat thay doi code on dinh.
- Da sua `auth-form` de chi dieu huong vao `/admin` voi role `ADMIN`/`EDITOR`, role khac ve `/`.
- Da sua middleware chi kiem tra cookie ton tai cho route `/admin`; quyen chi tiet duoc check tai `app/admin/layout.tsx`.
- Da them `getSession()` o home page va an 2 nut auth khi user da dang nhap.
- Da xoa nut login/register khoi hero home, hien tai chi con o nav bar.
- Da bo sung submit handler cho trang tao bai viet: goi `/api/admin/posts`, gui du payload bat buoc, va redirect ve danh sach bai viet khi tao thanh cong.
- Da bo sung load category tu `/api/admin/categories` de chon category khi tao bai.
- Da bo sung xu ly loi chi tiet cho tao bai viet (validation, slug trung, loi he thong) thay vi thong bao chung chung.

## Things not done yet
- Con 1 loi TypeScript tai `apps/web/app/page.tsx` lien quan kieu `Post[]` va `publishedAt` (co ve la loi ton tai san, khong do thay doi nut moi).
- Chua verify lai bang thao tac login thuc te tren browser sau khi restart dev server.
- Chua test thao tac tao bai viet truc tiep tren browser voi tai khoan `ADMIN`/`EDITOR`.
- Chua xac nhan trong browser truong hop khong co category nao.
