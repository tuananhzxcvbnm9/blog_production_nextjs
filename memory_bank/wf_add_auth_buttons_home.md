## Current tasks from user prompt
- Them button o man hinh de co the dang nhap va dang ki.
- Them hot reload khi thay doi code.

## Plan (simple)
- Xac dinh man hinh trang chu dang hien thi cho nguoi dung.
- Them 2 nut dieu huong den `/login` va `/register`.
- Kiem tra lint co loi phat sinh khong.
- Kiem tra script dev va bat co che watch polling de hot reload on dinh hon.

## Steps
- Doc file `apps/web/app/page.tsx`.
- Chen `Link` va 2 nut auth vao phan hero.
- Chay kiem tra lint cho file vua sua.
- Cap nhat trang thai cong viec.
- Sua `apps/web/package.json` script `dev` de bat polling.

## Things done
- Da tao file workflow de theo doi task.
- Da them nut `Dang nhap` va `Dang ky` tai `apps/web/app/page.tsx`.
- Da kiem tra lint cho file vua sua.
- Da bat `WATCHPACK_POLLING=true` trong script `dev` de hot reload bat thay doi code on dinh.

## Things not done yet
- Con 1 loi TypeScript tai `apps/web/app/page.tsx` lien quan kieu `Post[]` va `publishedAt` (co ve la loi ton tai san, khong do thay doi nut moi).
