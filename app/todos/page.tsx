'use client'

import { useEffect, useMemo, useState } from "react";

// tailgrids
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { TextField } from "@/components/tailgrids/core/text-field";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";

// data
import { fetchTodos, TodoType, type Todo } from "@/app/data/todos";

const STORAGE_KEY = "todosRaw";

function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 ${className}`}
    />
  );
}

// อ่านจาก localStorage: คืน null ถ้าไม่มี / พัง / รูปแบบไม่ถูกต้อง
function loadStoredTodos(): Todo[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Todo[]) : null;
  } catch {
    return null;
  }
}

export default function Page() {
  const router = useRouter()
    useEffect(() => checkLogin(router, '/todos'), [router])
    
  const [todosRaw, setTodosRaw] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false); // true เมื่อโหลดข้อมูลเริ่มต้นสำเร็จแล้วเท่านั้น
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  // dialog
  const [showDialogOpen, setShowDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // โหลดข้อมูลครั้งแรก: localStorage ก่อน ถ้าไม่มีค่อย fetch
// useEffect(() => {
//   const _todoRawStr = localStorage.getItem("todosRaw");

//   if (_todoRawStr === null) {
//     fetchTodos()
//       .then((data) => {
//         setTodosRaw(data as TodoType[]);
//         setHydrated(true); // fetch สำเร็จแล้วค่อยเปิดให้บันทึก
//       })
//       .catch(() => setTodosRaw([])) // พัง: ไม่เปิด hydrated จะได้ไม่เซฟ [] ทับ
//       .finally(() => setLoading(false));
//   } else {
//     setTodosRaw(JSON.parse(_todoRawStr));
//     setHydrated(true);
//     setLoading(false);
//   }
// }, []);

// // บันทึกลง localStorage เฉพาะหลังโหลดข้อมูลเริ่มต้นแล้ว
// useEffect(() => {
//   if (!hydrated) return;
//   localStorage.setItem("todosRaw", JSON.stringify(todosRaw));
// }, [todosRaw, hydrated]);

  // onload
  useEffect(() => {
    fetchTodos()
      .then((data) => setTodosRaw(data as TodoType[]))
      .catch((error) => setTodosRaw([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredTodos = useMemo(
    () =>
      onlyWaiting
        ? todosRaw.filter((todo) => todo.completed === false)
        : todosRaw,
    [onlyWaiting, todosRaw]
  );

  const nextId = useMemo(
    () => todosRaw.reduce((max, t) => (t.id > max ? t.id : max), 0) + 1,
    [todosRaw]
  );

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTodos = filteredTodos.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const openAddDialog = () => {
    setNewTitle("");
    setShowDialogOpen(true);
  };

  const addTodo = () => {
    const title = newTitle.trim();
    if (title === "") return;

    setTodosRaw((items) => [
      ...items,
      { userId: 1, id: nextId, title, completed: false },
    ]);
    setOnlyWaiting(false);
    setCurrentPage(1);
    setNewTitle("");
  };

  const toggleTodo = (id: number) =>
    setTodosRaw((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

  const deleteTodo = (id: number) =>
    setTodosRaw((items) => items.filter((item) => item.id !== id));

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-[800px] px-3">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Toggle
              label="Show only"
              checked={onlyWaiting}
              onChange={(e) => setOnlyWaiting(e.target.checked)}
            />
            &nbsp;
            <Button
              size="lg"
              className="h-8 bg-yellow-400 p-2 pointer-events-none hover:bg-yellow-700 hover:text-yellow-200"
            >
              Waiting
              <ClockThree />
            </Button>
          </div>

          <div className="w-2/5">
            <NativeSelect
              placeholder="Select an options"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <NativeSelectOption value={5}>5 items per page</NativeSelectOption>
              <NativeSelectOption value={10}>10 items per page</NativeSelectOption>
              <NativeSelectOption value={50}>50 items per page</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        <div className="mt-2">
          <TableRoot>
            <TableHeader>
              <TableRow className="bg-black text-white">
                <TableHead className="w-24 text-right font-bold">ID</TableHead>
                <TableHead className="text-center font-bold">Title</TableHead>
                <TableHead className="flex items-center justify-end gap-1 font-bold">
                  Completed
                  <Button
                    variant="primary"
                    className="h-8 p-2"
                    aria-label="เพิ่มงาน"
                    onClick={openAddDialog}
                  >
                    <Plus />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Spinner className="mx-auto" />
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredTodos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-500">
                    ไม่มีรายการงาน
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedTodos.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell className="text-right">
                      <Badge
                        size="lg"
                        className="rounded-lg bg-gray-500 font-bold text-white"
                      >
                        {todo.id}
                      </Badge>
                    </TableCell>

                    <TableCell>{todo.title}</TableCell>

                    <TableCell className="flex justify-end gap-1">
                      {todo.completed ? (
                        <Button
                          size="sm"
                          className="h-8 bg-green-700 text-white"
                          onClick={() => toggleTodo(todo.id)}
                        >
                          Done
                          <Check />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 bg-yellow-400 hover:bg-yellow-700 hover:text-yellow-200"
                          onClick={() => toggleTodo(todo.id)}
                        >
                          Waiting
                          <ClockThree />
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        className="h-8 p-2"
                        aria-label={`ลบงาน ${todo.id}`}
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash1 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableRoot>
        </div>

        {filteredTodos.length > 0 && (
          <div className="mx-auto mt-1 flex w-1/3 items-center justify-center gap-1">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
            >
              First
            </Button>
            <div>
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={(page) =>
                  setCurrentPage(Math.min(Math.max(page, 1), totalPages))
                }
                sideLayout="icon"
              />
            </div>
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
            >
              Last
            </Button>
          </div>
        )}
      </div>

      <Backdrop isOpen={showDialogOpen} onOpenChange={setShowDialogOpen}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="rounded-md bg-sky-200 p-1" size={32} /> New todo
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">ID (Auto Generated)</Label>
                <Input
                  className="pointer-events-none w-full bg-gray-200"
                  value={nextId}
                  readOnly
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">Title</Label>
                <Input
                  placeholder="ใส่งานที่ต้องการเพิ่ม"
                  className="w-full"
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={addTodo}>Add todo</DialogClose>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </>
  );
}