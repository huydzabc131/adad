import { User, Topic, Problem, Exam, Submission, ExamParticipant } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    full_name: 'Thầy Nguyễn Văn An',
    username: 'admin',
    password_hash: 'admin123',
    email: 'an.nguyen@algomaster.edu.vn',
    class_name: 'Tổ Tin Học',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T08:00:00Z',
    solved_count: 50,
    total_score: 5000,
  },
  {
    id: 'usr_std_1',
    full_name: 'Nguyễn Văn Nam',
    username: 'nguyenvannam',
    password_hash: '123456',
    email: 'nam.nv@student.edu.vn',
    class_name: '10A1',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-01T08:00:00Z',
    solved_count: 14,
    total_score: 1420,
  },
  {
    id: 'usr_std_2',
    full_name: 'Lê Thị Mai Hoa',
    username: 'lethimaihoa',
    password_hash: '123456',
    email: 'hoa.ltm@student.edu.vn',
    class_name: '11 Chuyên Tin',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-01T08:30:00Z',
    solved_count: 22,
    total_score: 2450,
  },
  {
    id: 'usr_std_3',
    full_name: 'Trần Minh Quang',
    username: 'tranminhquang',
    password_hash: '123456',
    email: 'quang.tm@student.edu.vn',
    class_name: '11 Chuyên Tin',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-02T09:00:00Z',
    solved_count: 19,
    total_score: 1980,
  },
  {
    id: 'usr_std_4',
    full_name: 'Phạm Bảo Trâm',
    username: 'phambaotram',
    password_hash: '123456',
    email: 'tram.pb@student.edu.vn',
    class_name: '10A1',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-03T10:00:00Z',
    solved_count: 8,
    total_score: 820,
  },
  {
    id: 'usr_std_5',
    full_name: 'Hoàng Đức Duy',
    username: 'hoangducduy',
    password_hash: '123456',
    email: 'duy.hd@student.edu.vn',
    class_name: '12 Tin',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-04T11:00:00Z',
    solved_count: 28,
    total_score: 3100,
  },
  {
    id: 'usr_std_6',
    full_name: 'Đặng Tuấn Kiệt',
    username: 'dangtuankiet',
    password_hash: '123456',
    email: 'kiet.dt@student.edu.vn',
    class_name: '10A2',
    role: 'STUDENT',
    status: 'LOCKED',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-05T14:00:00Z',
    solved_count: 3,
    total_score: 280,
  },
];

export const INITIAL_TOPICS: Topic[] = [
  // CƠ BẢN
  {
    id: 'top_io',
    name: 'Nhập xuất dữ liệu',
    slug: 'nhap-xuat-du-lieu',
    tier: 'BASIC',
    description: 'Các bài toán làm quen với cấu trúc chương trình, đọc và in dữ liệu chuẩn.',
    order: 1,
  },
  {
    id: 'top_var',
    name: 'Biến và kiểu dữ liệu',
    slug: 'bien-va-kieu-du-lieu',
    tier: 'BASIC',
    description: 'Xử lý các kiểu dữ liệu số nguyên, số thực, kí tự và ép kiểu.',
    order: 2,
  },
  {
    id: 'top_cond',
    name: 'Câu lệnh điều kiện',
    slug: 'cau-lenh-dieu-kien',
    tier: 'BASIC',
    description: 'Cấu trúc rẽ nhánh if - else, switch - case và biểu thức logic.',
    order: 3,
  },
  {
    id: 'top_loop',
    name: 'Vòng lặp',
    slug: 'vong-lap',
    tier: 'BASIC',
    description: 'Cấu trúc lặp for, while, do-while và các bài toán tính tổng, ước số.',
    order: 4,
  },
  {
    id: 'top_func',
    name: 'Hàm & Thủ tục',
    slug: 'ham-va-thu-tuc',
    tier: 'BASIC',
    description: 'Tổ chức chương trình con, truyền tham số và trả về kết quả.',
    order: 5,
  },
  {
    id: 'top_array1d',
    name: 'Mảng một chiều',
    slug: 'mang-mot-chieu',
    tier: 'BASIC',
    description: 'Khai báo, duyệt mảng, tìm min/max, đếm phần tử thỏa điều kiện.',
    order: 6,
  },
  {
    id: 'top_string',
    name: 'Chuỗi ký tự',
    slug: 'chuoi-ky-tu',
    tier: 'BASIC',
    description: 'Thao tác với chuỗi xâu, đảo ngược, chuẩn hóa, đếm từ, xâu đối xứng.',
    order: 7,
  },

  // TRUNG BÌNH
  {
    id: 'top_array2d',
    name: 'Mảng hai chiều',
    slug: 'mang-hai-chieu',
    tier: 'MEDIUM',
    description: 'Thao tác ma trận, đường chéo chính/phụ, xoay ma trận, tổng vùng.',
    order: 8,
  },
  {
    id: 'top_sort',
    name: 'Thuật toán Sắp xếp',
    slug: 'thuat-toan-sap-xep',
    tier: 'MEDIUM',
    description: 'Sắp xếp nổi bọt, chèn, chọn, Quick Sort, Merge Sort và hàm sort thư viện.',
    order: 9,
  },
  {
    id: 'top_search',
    name: 'Thuật toán Tìm kiếm',
    slug: 'thuat-toan-tim-kiem',
    tier: 'MEDIUM',
    description: 'Tìm kiếm tuần tự, tìm kiếm vị trí và các biến thể cơ bản.',
    order: 10,
  },
  {
    id: 'top_recursion',
    name: 'Đệ quy & Quay lui',
    slug: 'de-quy-quay-lui',
    tier: 'MEDIUM',
    description: 'Tư duy đệ quy chia để trị, bài toán sinh hoán vị, tổ hợp, N-Queens.',
    order: 11,
  },
  {
    id: 'top_stack_queue',
    name: 'Stack & Queue',
    slug: 'stack-queue',
    tier: 'MEDIUM',
    description: 'Ngăn xếp LIFO, hàng đợi FIFO, ngoặc hợp lệ, biến đổi biểu thức.',
    order: 12,
  },
  {
    id: 'top_linked_list',
    name: 'Linked List',
    slug: 'linked-list',
    tier: 'MEDIUM',
    description: 'Danh sách liên kết đơn, đôi, chèn xóa nút và ứng dụng.',
    order: 13,
  },

  // NÂNG CAO
  {
    id: 'top_binary_search',
    name: 'Binary Search',
    slug: 'binary-search',
    tier: 'ADVANCED',
    description: 'Chặt nhị phân trên mảng đã sắp xếp và chặt nhị phân kết quả (Binary Search on Answer).',
    order: 14,
  },
  {
    id: 'top_two_pointers',
    name: 'Two Pointers & Sliding Window',
    slug: 'two-pointers',
    tier: 'ADVANCED',
    description: 'Kỹ thuật 2 con trỏ cùng chiều, ngược chiều và cửa sổ trượt tối ưu $O(N)$.',
    order: 15,
  },
  {
    id: 'top_prefix_sum',
    name: 'Prefix Sum & Mảng hiệu',
    slug: 'prefix-sum',
    tier: 'ADVANCED',
    description: 'Truy vấn tổng đoạn $O(1)$, cập nhật đoạn $O(1)$ với mảng hiệu (Difference Array).',
    order: 16,
  },
  {
    id: 'top_dp',
    name: 'Dynamic Programming (DP)',
    slug: 'dynamic-programming',
    tier: 'ADVANCED',
    description: 'Quy hoạch động 1D, 2D, Dãy con tăng dài nhất (LIS), Cái túi (Knapsack), DP trên chuỗi.',
    order: 17,
  },
  {
    id: 'top_greedy',
    name: 'Thuật toán Tham lam (Greedy)',
    slug: 'greedy',
    tier: 'ADVANCED',
    description: 'Chứng minh tham lam, xếp lịch, đổi tiền, cây khung nhỏ nhất Kruskal.',
    order: 18,
  },
  {
    id: 'top_graph',
    name: 'Đồ thị (Graph DFS/BFS)',
    slug: 'graph-dfs-bfs',
    tier: 'ADVANCED',
    description: 'Duyệt theo chiều sâu DFS, chiều rộng BFS, thành phần liên thông, chu trình.',
    order: 19,
  },
  {
    id: 'top_shortest_path',
    name: 'Shortest Path (Dijkstra/Floyd)',
    slug: 'shortest-path',
    tier: 'ADVANCED',
    description: 'Tìm đường đi ngắn nhất có trọng số không âm bằng Dijkstra kết hợp Priority Queue.',
    order: 20,
  },
  {
    id: 'top_segment_tree',
    name: 'Cây phân đoạn (Segment Tree/Fenwick)',
    slug: 'segment-tree',
    tier: 'ADVANCED',
    description: 'Cấu trúc dữ liệu nâng cao truy vấn và cập nhật điểm/đoạn trong $O(\\log N)$.',
    order: 21,
  },
];

export const INITIAL_PROBLEMS: Problem[] = [
  // 1. Basic - IO
  {
    id: 'prob_1',
    title: 'Tính tổng hai số nguyên A và B',
    slug: 'tinh-tong-hai-so-nguyen-a-b',
    topic_id: 'top_io',
    difficulty: 'BASIC',
    description: `Cho hai số nguyên $A$ và $B$. Hãy tính và in ra màn hình tổng của hai số đó ($A + B$).\n\nĐây là bài tập nhập môn giúp bạn làm quen với việc đọc dữ liệu từ luồng nhập chuẩn (Standard Input) và xuất kết quả ra luồng xuất chuẩn (Standard Output).`,
    input_description: 'Gồm một dòng duy nhất chứa hai số nguyên $A$ và $B$ cách nhau bởi dấu cách.',
    output_description: 'In ra một số nguyên duy nhất là kết quả của $A + B$.',
    constraints: '$-10^9 \\le A, B \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-15T10:00:00Z',
    sample_tests: [
      {
        id: 'tc_1_1',
        problem_id: 'prob_1',
        input: '5 7',
        expected_output: '12',
        is_hidden: false,
        explanation: 'Tổng của 5 và 7 là 12.',
      },
      {
        id: 'tc_1_2',
        problem_id: 'prob_1',
        input: '-10 25',
        expected_output: '15',
        is_hidden: false,
        explanation: '-10 + 25 = 15.',
      },
    ],
    hidden_tests: [
      {
        id: 'tc_1_3',
        problem_id: 'prob_1',
        input: '0 0',
        expected_output: '0',
        is_hidden: true,
      },
      {
        id: 'tc_1_4',
        problem_id: 'prob_1',
        input: '1000000000 1000000000',
        expected_output: '2000000000',
        is_hidden: true,
      },
      {
        id: 'tc_1_5',
        problem_id: 'prob_1',
        input: '-500000000 -500000000',
        expected_output: '-1000000000',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `# Nhập A và B từ input
a, b = map(int, input().split())

# Viết code tính tổng và in ra màn hình
print(a + b)
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    long long a, b;
    if (scanf("%lld %lld", &a, &b) == 2) {
        printf("%lld\\n", a + b);
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        System.out.println(a + b);
    }
}
`,
    },
    hints: [
      'Chú ý kiểu dữ liệu: Nếu $A, B$ lên tới $10^9$, tổng $A+B$ có thể vượt quá giới hạn kiểu int 32-bit nếu phạm vi mở rộng. Trong C/C++, nên dùng long long.',
      'Sử dụng `map(int, input().split())` trong Python để đọc nhanh 2 số trên cùng một dòng.',
    ],
    tags: ['Nhập xuất', 'Toán cơ bản', 'Căn bản'],
    total_submissions: 156,
    accepted_submissions: 142,
  },

  // 2. Basic - Condition
  {
    id: 'prob_2',
    title: 'Kiểm tra năm nhuận (Leap Year)',
    slug: 'kiem-tra-nam-nhuan',
    topic_id: 'top_cond',
    difficulty: 'BASIC',
    description: `Một năm dương lịch được gọi là năm nhuận nếu:\n- Năm đó chia hết cho 400, HOẶC\n- Năm đó chia hết cho 4 nhưng KHÔNG chia hết cho 100.\n\nCho vào một năm dương lịch $Y$. Hãy in ra **YES** nếu đó là năm nhuận, ngược lại in ra **NO**.`,
    input_description: 'Một số nguyên dương $Y$ duy nhất đại diện cho năm cần kiểm tra.',
    output_description: 'In ra chuỗi "YES" nếu năm nhuận, "NO" nếu không phải.',
    constraints: '$1 \\le Y \\le 10^5$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-16T14:00:00Z',
    sample_tests: [
      {
        id: 'tc_2_1',
        problem_id: 'prob_2',
        input: '2024',
        expected_output: 'YES',
        is_hidden: false,
        explanation: '2024 chia hết cho 4 và không chia hết cho 100 -> Năm nhuận.',
      },
      {
        id: 'tc_2_2',
        problem_id: 'prob_2',
        input: '1900',
        expected_output: 'NO',
        is_hidden: false,
        explanation: '1900 chia hết cho 100 nhưng không chia hết cho 400 -> Không phải năm nhuận.',
      },
      {
        id: 'tc_2_3',
        problem_id: 'prob_2',
        input: '2000',
        expected_output: 'YES',
        is_hidden: false,
        explanation: '2000 chia hết cho 400 -> Năm nhuận.',
      },
    ],
    hidden_tests: [
      {
        id: 'tc_2_4',
        problem_id: 'prob_2',
        input: '2025',
        expected_output: 'NO',
        is_hidden: true,
      },
      {
        id: 'tc_2_5',
        problem_id: 'prob_2',
        input: '2400',
        expected_output: 'YES',
        is_hidden: true,
      },
      {
        id: 'tc_2_6',
        problem_id: 'prob_2',
        input: '2100',
        expected_output: 'NO',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `year = int(input())

# Kiểm tra điều kiện năm nhuận
if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
    print("YES")
else:
    print("NO")
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;
    if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
        cout << "YES\\n";
    } else {
        cout << "NO\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int y;
    scanf("%d", &y);
    if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
        printf("YES\\n");
    } else {
        printf("NO\\n");
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int y = sc.nextInt();
        if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
    }
}
`,
    },
    hints: ['Sử dụng toán tử logic `or` và `and` (trong C++ là `||` và `&&`).'],
    tags: ['Điều kiện', 'Toán', 'Căn bản'],
    total_submissions: 110,
    accepted_submissions: 98,
  },

  // 3. Basic - Loop
  {
    id: 'prob_3',
    title: 'Tính tổng các số chẵn từ 1 đến N',
    slug: 'tong-cac-so-chan-tu-1-den-n',
    topic_id: 'top_loop',
    difficulty: 'BASIC',
    description: `Cho số nguyên dương $N$. Hãy tính tổng tất cả các số chẵn nằm trong đoạn từ $1$ đến $N$.\n\nVí dụ với $N = 6$, các số chẵn là $2, 4, 6$. Tổng là $2 + 4 + 6 = 12$.`,
    input_description: 'Một số nguyên dương $N$.',
    output_description: 'In ra một số nguyên duy nhất là tổng các số chẵn.',
    constraints: '$1 \\le N \\le 10^6$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-18T10:00:00Z',
    sample_tests: [
      {
        id: 'tc_3_1',
        problem_id: 'prob_3',
        input: '6',
        expected_output: '12',
        is_hidden: false,
      },
      {
        id: 'tc_3_2',
        problem_id: 'prob_3',
        input: '10',
        expected_output: '30',
        is_hidden: false,
      },
    ],
    hidden_tests: [
      {
        id: 'tc_3_3',
        problem_id: 'prob_3',
        input: '1',
        expected_output: '0',
        is_hidden: true,
      },
      {
        id: 'tc_3_4',
        problem_id: 'prob_3',
        input: '1000000',
        expected_output: '250000500000',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `n = int(input())
k = n // 2
# Tổng k số chẵn đầu tiên: 2 + 4 + ... + 2k = k * (k + 1)
print(k * (k + 1))
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long k = n / 2;
    cout << k * (k + 1) << endl;
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    long long n;
    scanf("%lld", &n);
    long long k = n / 2;
    printf("%lld\\n", k * (k + 1));
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long k = n / 2;
        System.out.println(k * (k + 1));
    }
}
`,
    },
    hints: ['Có thể dùng vòng lặp `for i in range(2, n + 1, 2)` hoặc công thức toán học $k \\times (k + 1)$ với $k = \\lfloor N / 2 \\rfloor$.'],
    tags: ['Vòng lặp', 'Toán học', 'Căn bản'],
    total_submissions: 95,
    accepted_submissions: 87,
  },

  // 4. Basic - 1D Array
  {
    id: 'prob_4',
    title: 'Tìm phần tử lớn nhất và vị trí đầu tiên',
    slug: 'tim-phan-tu-lon-nhat-va-vi-tri',
    topic_id: 'top_array1d',
    difficulty: 'BASIC',
    description: `Cho mảng gồm $N$ số nguyên $A_1, A_2, \\dots, A_N$. Hãy tìm giá trị lớn nhất trong mảng và chỉ số (index bắt đầu từ 1) của phần tử lớn nhất xuất hiện đầu tiên.`,
    input_description: 'Dòng 1: Chứa số nguyên $N$.\nDòng 2: Chứa $N$ số nguyên cách nhau bởi dấu cách.',
    output_description: 'In ra hai số nguyên trên một dòng cách nhau bởi dấu cách: Giá_trị_lớn_nhất và Vị_trí_1_based.',
    constraints: '$1 \\le N \\le 10^5$, $-10^9 \\le A_i \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-20T09:00:00Z',
    sample_tests: [
      {
        id: 'tc_4_1',
        problem_id: 'prob_4',
        input: `5
3 7 2 7 1`,
        expected_output: '7 2',
        is_hidden: false,
        explanation: 'Giá trị lớn nhất là 7, xuất hiện lần đầu ở vị trí 2.',
      },
      {
        id: 'tc_4_2',
        problem_id: 'prob_4',
        input: `4
-5 -2 -9 -2`,
        expected_output: '-2 2',
        is_hidden: false,
      },
    ],
    hidden_tests: [
      {
        id: 'tc_4_3',
        problem_id: 'prob_4',
        input: `1
100`,
        expected_output: '100 1',
        is_hidden: true,
      },
      {
        id: 'tc_4_4',
        problem_id: 'prob_4',
        input: `6
10 20 30 40 50 60`,
        expected_output: '60 6',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `n = int(input())
arr = list(map(int, input().split()))

max_val = arr[0]
pos = 1

for i in range(1, n):
    if arr[i] > max_val:
        max_val = arr[i]
        pos = i + 1

print(max_val, pos)
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        long long max_val;
        int pos = 1;
        cin >> max_val;
        for (int i = 2; i <= n; i++) {
            long long x;
            cin >> x;
            if (x > max_val) {
                max_val = x;
                pos = i;
            }
        }
        cout << max_val << " " << pos << "\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        long long max_val;
        int pos = 1;
        scanf("%lld", &max_val);
        for (int i = 2; i <= n; i++) {
            long long x;
            scanf("%lld", &x);
            if (x > max_val) {
                max_val = x;
                pos = i;
            }
        }
        printf("%lld %d\\n", max_val, pos);
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long maxVal = sc.nextLong();
        int pos = 1;
        for (int i = 2; i <= n; i++) {
            long x = sc.nextLong();
            if (x > maxVal) {
                maxVal = x;
                pos = i;
            }
        }
        System.out.println(maxVal + " " + pos);
    }
}
`,
    },
    hints: ['Khởi tạo max_val = phần tử đầu tiên và vị trí = 1, duyệt từ phần tử 2 đến N.'],
    tags: ['Mảng 1 chiều', 'Tìm kiếm cơ bản', 'Căn bản'],
    total_submissions: 88,
    accepted_submissions: 79,
  },

  // 5. Basic - String
  {
    id: 'prob_5',
    title: 'Kiểm tra xâu đối xứng (Palindrome)',
    slug: 'kiem-tra-xau-doi-xung',
    topic_id: 'top_string',
    difficulty: 'BASIC',
    description: `Một chuỗi ký tự được gọi là đối xứng (Palindrome) nếu đọc từ trái sang phải hay từ phải sang trái đều như nhau (không phân biệt hoa thường và chỉ xét các ký tự chữ cái và số).\n\nCho chuỗi $S$. Hãy in ra **YES** nếu $S$ là xâu đối xứng, ngược lại in ra **NO**.`,
    input_description: 'Một dòng chứa chuỗi ký tự $S$.',
    output_description: 'In ra "YES" hoặc "NO".',
    constraints: '$1 \\le |S| \\le 10^5$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-22T11:00:00Z',
    sample_tests: [
      {
        id: 'tc_5_1',
        problem_id: 'prob_5',
        input: 'radar',
        expected_output: 'YES',
        is_hidden: false,
      },
      {
        id: 'tc_5_2',
        problem_id: 'prob_5',
        input: 'algomaster',
        expected_output: 'NO',
        is_hidden: false,
      },
      {
        id: 'tc_5_3',
        problem_id: 'prob_5',
        input: 'Racecar',
        expected_output: 'YES',
        is_hidden: false,
      },
    ],
    hidden_tests: [
      {
        id: 'tc_5_4',
        problem_id: 'prob_5',
        input: 'a',
        expected_output: 'YES',
        is_hidden: true,
      },
      {
        id: 'tc_5_5',
        problem_id: 'prob_5',
        input: 'abccba',
        expected_output: 'YES',
        is_hidden: true,
      },
      {
        id: 'tc_5_6',
        problem_id: 'prob_5',
        input: 'abcde',
        expected_output: 'NO',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `s = input().strip().lower()
# Chỉ giữ ký tự alphanumeric nếu cần hoặc kiểm tra đối xứng
clean_s = ''.join(c for c in s if c.isalnum())
if clean_s == clean_s[::-1]:
    print("YES")
else:
    print("NO")
`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        string clean = "";
        for (char c : s) {
            if (isalnum(c)) clean += tolower(c);
        }
        string rev = clean;
        reverse(rev.begin(), rev.end());
        if (clean == rev) cout << "YES\\n";
        else cout << "NO\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[100005];
    if (scanf("%s", s) == 1) {
        int l = 0, r = strlen(s) - 1;
        int ok = 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) {
                ok = 0;
                break;
            }
            l++;
            r--;
        }
        if (ok) printf("YES\\n");
        else printf("NO\\n");
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            StringBuilder clean = new StringBuilder();
            for (char c : s.toCharArray()) {
                if (Character.isLetterOrDigit(c)) clean.append(Character.toLowerCase(c));
            }
            String str = clean.toString();
            String rev = clean.reverse().toString();
            if (str.equals(rev)) System.out.println("YES");
            else System.out.println("NO");
        }
    }
}
`,
    },
    hints: ['Chuyển tất cả ký tự về chữ thường rồi dùng kỹ thuật 2 con trỏ đối xứng từ 2 đầu.'],
    tags: ['Chuỗi ký tự', 'Two Pointers', 'Căn bản'],
    total_submissions: 75,
    accepted_submissions: 68,
  },

  // 6. Medium - Sorting
  {
    id: 'prob_6',
    title: 'Sắp xếp dãy số theo giá trị tuyệt đối',
    slug: 'sap-xep-theo-gia-tri-tuyet-doi',
    topic_id: 'top_sort',
    difficulty: 'MEDIUM',
    description: `Cho mảng $A$ gồm $N$ số nguyên. Hãy sắp xếp mảng theo thứ tự giá trị tuyệt đối tăng dần $|A_i|$.\n\nNếu hai phần tử có cùng giá trị tuyệt đối, phần tử nào có giá trị đại số nhỏ hơn sẽ đứng trước.`,
    input_description: 'Dòng 1: Số nguyên $N$.\nDòng 2: $N$ số nguyên cách nhau bởi dấu cách.',
    output_description: 'In ra dãy số sau khi sắp xếp trên một dòng.',
    constraints: '$1 \\le N \\le 10^5$, $-10^9 \\le A_i \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-25T15:00:00Z',
    sample_tests: [
      {
        id: 'tc_6_1',
        problem_id: 'prob_6',
        input: `5
3 -2 1 -3 2`,
        expected_output: '1 -2 2 -3 3',
        is_hidden: false,
        explanation: '|-2|=2 và |2|=2, do -2 < 2 nên -2 đứng trước 2.',
      },
    ],
    hidden_tests: [
      {
        id: 'tc_6_2',
        problem_id: 'prob_6',
        input: `4
-10 10 -5 5`,
        expected_output: '-5 5 -10 10',
        is_hidden: true,
      },
      {
        id: 'tc_6_3',
        problem_id: 'prob_6',
        input: `3
0 -1 1`,
        expected_output: '0 -1 1',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `n = int(input())
arr = list(map(int, input().split()))

# Sắp xếp theo (abs(x), x)
arr.sort(key=lambda x: (abs(x), x))
print(*(arr))
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

bool customCompare(long long a, long long b) {
    if (abs(a) != abs(b)) {
        return abs(a) < abs(b);
    }
    return a < b;
}

int main() {
    int n;
    if (cin >> n) {
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        sort(a.begin(), a.end(), customCompare);
        for (int i = 0; i < n; i++) {
            cout << a[i] << (i == n - 1 ? "" : " ");
        }
        cout << "\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int cmp(const void *a, const void *b) {
    long long x = *(long long*)a;
    long long y = *(long long*)b;
    if (llabs(x) != llabs(y)) {
        return llabs(x) < llabs(y) ? -1 : 1;
    }
    return x < y ? -1 : 1;
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        long long a[100005];
        for (int i = 0; i < n; i++) scanf("%lld", &a[i]);
        qsort(a, n, sizeof(long long), cmp);
        for (int i = 0; i < n; i++) {
            printf("%lld%s", a[i], i == n - 1 ? "" : " ");
        }
        printf("\\n");
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            Long[] a = new Long[n];
            for (int i = 0; i < n; i++) a[i] = sc.nextLong();
            Arrays.sort(a, (x, y) -> {
                long ax = Math.abs(x);
                long ay = Math.abs(y);
                if (ax != ay) return Long.compare(ax, ay);
                return Long.compare(x, y);
            });
            for (int i = 0; i < n; i++) {
                System.out.print(a[i] + (i == n - 1 ? "" : " "));
            }
            System.out.println();
        }
    }
}
`,
    },
    hints: ['Viết hàm so sánh tùy biến (custom comparator) với 2 tiêu chí: abs(a) < abs(b), nếu bằng thì so sánh đại số a < b.'],
    tags: ['Sắp xếp', 'Comparator', 'Trung bình'],
    total_submissions: 64,
    accepted_submissions: 49,
  },

  // 7. Medium - Stack
  {
    id: 'prob_7',
    title: 'Kiểm tra dãy ngoặc đúng (Valid Parentheses)',
    slug: 'kiem-tra-day-ngoac-dung',
    topic_id: 'top_stack_queue',
    difficulty: 'MEDIUM',
    description: `Cho một chuỗi $S$ chỉ gồm các ký tự mở đóng ngoặc: '(', ')', '[', ']', '{', '}'.\n\nChuỗi ngoặc được coi là hợp lệ nếu:\n1. Mọi dấu mở ngoặc đều được đóng bởi dấu ngoặc cùng loại tương ứng.\n2. Các dấu ngoặc được đóng theo đúng thứ tự lồng nhau.\n\nIn ra **YES** nếu hợp lệ, ngược lại in ra **NO**.`,
    input_description: 'Một dòng chứa chuỗi $S$.',
    output_description: 'In ra "YES" hoặc "NO".',
    constraints: '$1 \\le |S| \\le 10^5$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-01-28T09:00:00Z',
    sample_tests: [
      {
        id: 'tc_7_1',
        problem_id: 'prob_7',
        input: '()[]{}',
        expected_output: 'YES',
        is_hidden: false,
      },
      {
        id: 'tc_7_2',
        problem_id: 'prob_7',
        input: '([)]',
        expected_output: 'NO',
        is_hidden: false,
      },
      {
        id: 'tc_7_3',
        problem_id: 'prob_7',
        input: '{[]}',
        expected_output: 'YES',
        is_hidden: false,
      },
    ],
    hidden_tests: [
      {
        id: 'tc_7_4',
        problem_id: 'prob_7',
        input: '(((',
        expected_output: 'NO',
        is_hidden: true,
      },
      {
        id: 'tc_7_5',
        problem_id: 'prob_7',
        input: '][',
        expected_output: 'NO',
        is_hidden: true,
      },
      {
        id: 'tc_7_6',
        problem_id: 'prob_7',
        input: '{[()()]}',
        expected_output: 'YES',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `s = input().strip()
stack = []
mapping = {')': '(', ']': '[', '}': '{'}
valid = True

for char in s:
    if char in mapping.values():
        stack.append(char)
    elif char in mapping:
        if not stack or stack[-1] != mapping[char]:
            valid = False
            break
        stack.pop()

if valid and len(stack) == 0:
    print("YES")
else:
    print("NO")
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        stack<char> st;
        bool ok = true;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty()) { ok = false; break; }
                char top = st.top();
                if ((c == ')' && top == '(') ||
                    (c == ']' && top == '[') ||
                    (c == '}' && top == '{')) {
                    st.pop();
                } else {
                    ok = false; break;
                }
            }
        }
        if (ok && st.empty()) cout << "YES\\n";
        else cout << "NO\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[100005];
    if (scanf("%s", s) == 1) {
        char st[100005];
        int top = 0;
        int ok = 1;
        int n = strlen(s);
        for (int i = 0; i < n; i++) {
            char c = s[i];
            if (c == '(' || c == '[' || c == '{') {
                st[top++] = c;
            } else {
                if (top == 0) { ok = 0; break; }
                char t = st[top - 1];
                if ((c == ')' && t == '(') ||
                    (c == ']' && t == '[') ||
                    (c == '}' && t == '{')) {
                    top--;
                } else {
                    ok = 0; break;
                }
            }
        }
        if (ok && top == 0) printf("YES\\n");
        else printf("NO\\n");
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            Stack<Character> st = new Stack<>();
            boolean ok = true;
            for (char c : s.toCharArray()) {
                if (c == '(' || c == '[' || c == '{') {
                    st.push(c);
                } else {
                    if (st.isEmpty()) { ok = false; break; }
                    char top = st.pop();
                    if ((c == ')' && top != '(') ||
                        (c == ']' && top != '[') ||
                        (c == '}' && top != '{')) {
                        ok = false; break;
                    }
                }
            }
            if (ok && st.isEmpty()) System.out.println("YES");
            else System.out.println("NO");
        }
    }
}
`,
    },
    hints: ['Sử dụng cấu trúc dữ liệu Ngăn xếp (Stack): Gặp dấu mở thì push vào stack, gặp dấu đóng thì pop và kiểm tra khớp.'],
    tags: ['Stack', 'Chuỗi', 'Trung bình'],
    total_submissions: 82,
    accepted_submissions: 65,
  },

  // 8. Advanced - Binary Search
  {
    id: 'prob_8',
    title: 'Tìm kiếm phần tử trong mảng đã sắp xếp',
    slug: 'tim-kiem-nhi-phan-tren-mang',
    topic_id: 'top_binary_search',
    difficulty: 'ADVANCED',
    description: `Cho dãy $A$ gồm $N$ số nguyên đã được sắp xếp tăng dần và $Q$ truy vấn. Mỗi truy vấn gồm một số nguyên $X$.\n\nVới mỗi truy vấn, hãy tìm vị trí đầu tiên xuất hiện của $X$ trong dãy $A$ (vị trí đánh số từ 1). Nếu không tìm thấy, in ra $-1$.`,
    input_description: 'Dòng 1: Hai số nguyên $N$ và $Q$.\nDòng 2: $N$ số nguyên của dãy $A$ (tăng dần).\n$Q$ dòng tiếp theo: Mỗi dòng chứa một số nguyên $X$.',
    output_description: 'Gồm $Q$ dòng, mỗi dòng là kết quả của truy vấn tương ứng.',
    constraints: '$1 \\le N, Q \\le 10^5$, $-10^9 \\le A_i, X \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-02-01T10:00:00Z',
    sample_tests: [
      {
        id: 'tc_8_1',
        problem_id: 'prob_8',
        input: `5 3
1 2 4 4 9
4
2
7`,
        expected_output: `3
2
-1`,
        is_hidden: false,
        explanation: 'Số 4 xuất hiện lần đầu ở vị trí 3. Số 2 ở vị trí 2. Số 7 không có trong dãy (-1).',
      },
    ],
    hidden_tests: [
      {
        id: 'tc_8_2',
        problem_id: 'prob_8',
        input: `4 2
-10 -5 0 10
-10
0`,
        expected_output: `1
3`,
        is_hidden: true,
      },
      {
        id: 'tc_8_3',
        problem_id: 'prob_8',
        input: `3 1
5 5 5
5`,
        expected_output: '1',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `import bisect
import sys

input = sys.stdin.read
data = input().split()
if data:
    n = int(data[0])
    q = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    queries = [int(x) for x in data[2+n:2+n+q]]
    
    for x in queries:
        idx = bisect.bisect_left(arr, x)
        if idx < n and arr[idx] == x:
            print(idx + 1)
        else:
            print(-1)
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (cin >> n >> q) {
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        while (q--) {
            long long x;
            cin >> x;
            auto it = lower_bound(a.begin(), a.end(), x);
            if (it != a.end() && *it == x) {
                cout << (it - a.begin() + 1) << "\\n";
            } else {
                cout << -1 << "\\n";
            }
        }
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int lower_bound_fn(long long a[], int n, long long x) {
    int l = 0, r = n - 1, res = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (a[mid] >= x) {
            if (a[mid] == x) res = mid;
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }
    return res;
}

int main() {
    int n, q;
    if (scanf("%d %d", &n, &q) == 2) {
        long long a[100005];
        for (int i = 0; i < n; i++) scanf("%lld", &a[i]);
        while (q--) {
            long long x;
            scanf("%lld", &x);
            int idx = lower_bound_fn(a, n, x);
            if (idx != -1) printf("%d\\n", idx + 1);
            else printf("-1\\n");
        }
    }
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken());
        int q = Integer.parseInt(st.nextToken());
        long[] a = new long[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
        
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < q; k++) {
            long x = Long.parseLong(br.readLine().trim());
            int l = 0, r = n - 1, res = -1;
            while (l <= r) {
                int mid = l + (r - l) / 2;
                if (a[mid] >= x) {
                    if (a[mid] == x) res = mid;
                    r = mid - 1;
                } else {
                    l = mid + 1;
                }
            }
            sb.append(res != -1 ? (res + 1) : -1).append("\\n");
        }
        System.out.print(sb);
    }
}
`,
    },
    hints: ['Sử dụng thuật toán Tìm kiếm nhị phân (Binary Search / lower_bound) để đạt độ phức tạp $O(Q \\log N)$.'],
    tags: ['Binary Search', 'Độ phức tạp O(logN)', 'Nâng cao'],
    total_submissions: 52,
    accepted_submissions: 34,
  },

  // 9. Advanced - Dynamic Programming
  {
    id: 'prob_9',
    title: 'Dãy con tăng dài nhất (Longest Increasing Subsequence)',
    slug: 'day-con-tang-dai-nhat-lis',
    topic_id: 'top_dp',
    difficulty: 'ADVANCED',
    description: `Cho mảng $A$ gồm $N$ số nguyên. Một dãy con tăng của mảng $A$ là một dãy thu được bằng cách xóa đi một số phần tử (hoặc không xóa phần tử nào) mà các phần tử còn lại giữ nguyên thứ tự và giá trị tăng dần nghiêm ngặt ($A_{i_1} < A_{i_2} < \\dots < A_{i_k}$ với $i_1 < i_2 < \\dots < i_k$).\n\nHãy tìm độ dài của dãy con tăng dài nhất.`,
    input_description: 'Dòng 1: Số nguyên $N$.\nDòng 2: $N$ số nguyên cách nhau bởi dấu cách.',
    output_description: 'In ra một số nguyên duy nhất là độ dài dãy con tăng dài nhất.',
    constraints: '$1 \\le N \\le 10^5$, $-10^9 \\le A_i \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-02-05T12:00:00Z',
    sample_tests: [
      {
        id: 'tc_9_1',
        problem_id: 'prob_9',
        input: `6
1 2 5 3 4 7`,
        expected_output: '5',
        is_hidden: false,
        explanation: 'Dãy con tăng dài nhất là [1, 2, 3, 4, 7] có độ dài bằng 5.',
      },
      {
        id: 'tc_9_2',
        problem_id: 'prob_9',
        input: `4
5 4 3 2`,
        expected_output: '1',
        is_hidden: false,
      },
    ],
    hidden_tests: [
      {
        id: 'tc_9_3',
        problem_id: 'prob_9',
        input: `8
10 9 2 5 3 7 101 18`,
        expected_output: '4',
        is_hidden: true,
      },
      {
        id: 'tc_9_4',
        problem_id: 'prob_9',
        input: `1
42`,
        expected_output: '1',
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `import bisect

n = int(input())
arr = list(map(int, input().split()))

# Quy hoạch động kết hợp Binary Search O(N log N)
lis = []
for x in arr:
    idx = bisect.bisect_left(lis, x)
    if idx == len(lis):
        lis.append(x)
    else:
        lis[idx] = x

print(len(lis))
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        vector<int> lis;
        for (int x : a) {
            auto it = lower_bound(lis.begin(), lis.end(), x);
            if (it == lis.end()) {
                lis.push_back(x);
            } else {
                *it = x;
            }
        }
        cout << lis.size() << "\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int lower_bound_arr(int a[], int n, int x) {
    int l = 0, r = n - 1, res = n;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (a[mid] >= x) {
            res = mid;
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }
    return res;
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int lis[100005];
        int len = 0;
        for (int i = 0; i < n; i++) {
            int x;
            scanf("%d", &x);
            int idx = lower_bound_arr(lis, len, x);
            if (idx == len) {
                lis[len++] = x;
            } else {
                lis[idx] = x;
            }
        }
        printf("%d\\n", len);
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            ArrayList<Integer> lis = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                int x = sc.nextInt();
                int idx = Collections.binarySearch(lis, x);
                if (idx < 0) idx = -(idx + 1);
                if (idx == lis.size()) lis.add(x);
                else lis.set(idx, x);
            }
            System.out.println(lis.size());
        }
    }
}
`,
    },
    hints: [
      'Với $N \\le 10^5$, thuật toán $O(N^2)$ sẽ bị Time Limit Exceeded (TLE).',
      'Hãy kết hợp Quy hoạch động với Tìm kiếm nhị phân (Patience Sorting) để có độ phức tạp $O(N \\log N)$.',
    ],
    tags: ['Dynamic Programming', 'Binary Search', 'Nâng cao'],
    total_submissions: 47,
    accepted_submissions: 26,
  },

  // 10. Advanced - Prefix Sum
  {
    id: 'prob_10',
    title: 'Truy vấn tổng đoạn liên tiếp (Range Sum Query)',
    slug: 'truy-van-tong-doan-lien-tiep',
    topic_id: 'top_prefix_sum',
    difficulty: 'ADVANCED',
    description: `Cho dãy số $A$ gồm $N$ phần tử và $Q$ truy vấn. Mỗi truy vấn gồm hai số nguyên $L$ và $R$ ($1 \\le L \\le R \\le N$).\n\nHãy tính tổng các phần tử từ vị trí $L$ đến vị trí $R$: $\\sum_{i=L}^{R} A_i$.`,
    input_description: 'Dòng 1: Hai số nguyên $N$ và $Q$.\nDòng 2: $N$ số nguyên của dãy $A$.\n$Q$ dòng tiếp theo: Mỗi dòng gồm hai số $L$ và $R$.',
    output_description: 'Gồm $Q$ dòng, mỗi dòng là tổng đoạn con tương ứng.',
    constraints: '$1 \\le N, Q \\le 10^5$, $-10^9 \\le A_i \\le 10^9$',
    time_limit: 1.0,
    memory_limit: 256,
    created_by: 'usr_admin_1',
    created_at: '2026-02-08T10:00:00Z',
    sample_tests: [
      {
        id: 'tc_10_1',
        problem_id: 'prob_10',
        input: `5 3
2 4 1 7 3
1 3
2 4
1 5`,
        expected_output: `7
12
17`,
        is_hidden: false,
        explanation: 'Tổng từ 1 đến 3 là 2+4+1=7. Tổng từ 2 đến 4 là 4+1+7=12. Tổng toàn mảng là 17.',
      },
    ],
    hidden_tests: [
      {
        id: 'tc_10_2',
        problem_id: 'prob_10',
        input: `3 1
-5 10 -2
1 3`,
        expected_output: '3',
        is_hidden: true,
      },
      {
        id: 'tc_10_3',
        problem_id: 'prob_10',
        input: `4 2
100 200 300 400
2 2
3 4`,
        expected_output: `200
700`,
        is_hidden: true,
      },
    ],
    starter_code: {
      python: `import sys

input = sys.stdin.read
data = input().split()
if data:
    n = int(data[0])
    q = int(data[1])
    a = [int(x) for x in data[2:2+n]]
    
    # Xây dựng mảng cộng dồn Prefix Sum
    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + a[i]
        
    idx = 2 + n
    for _ in range(q):
        l = int(data[idx])
        r = int(data[idx + 1])
        idx += 2
        print(pref[r] - pref[l - 1])
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (cin >> n >> q) {
        vector<long long> pref(n + 1, 0);
        for (int i = 1; i <= n; i++) {
            long long x;
            cin >> x;
            pref[i] = pref[i - 1] + x;
        }
        while (q--) {
            int l, r;
            cin >> l >> r;
            cout << pref[r] - pref[l - 1] << "\\n";
        }
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int n, q;
    if (scanf("%d %d", &n, &q) == 2) {
        long long pref[100005];
        pref[0] = 0;
        for (int i = 1; i <= n; i++) {
            long long x;
            scanf("%lld", &x);
            pref[i] = pref[i - 1] + x;
        }
        while (q--) {
            int l, r;
            scanf("%d %d", &l, &r);
            printf("%lld\\n", pref[r] - pref[l - 1]);
        }
    }
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken());
        int q = Integer.parseInt(st.nextToken());
        long[] pref = new long[n + 1];
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= n; i++) {
            pref[i] = pref[i - 1] + Long.parseLong(st.nextToken());
        }
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < q; k++) {
            st = new StringTokenizer(br.readLine());
            int l = Integer.parseInt(st.nextToken());
            int r = Integer.parseInt(st.nextToken());
            sb.append(pref[r] - pref[l - 1]).append("\\n");
        }
        System.out.print(sb);
    }
}
`,
    },
    hints: ['Tiền xử lý mảng $Prefix[i] = Prefix[i-1] + A[i]$, khi đó tổng từ $L$ đến $R$ là $Prefix[R] - Prefix[L-1]$ trong $O(1)$.'],
    tags: ['Prefix Sum', 'Xử lý truy vấn', 'Nâng cao'],
    total_submissions: 59,
    accepted_submissions: 48,
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_1',
    title: 'Kiểm tra Thuật toán Cơ bản (10A1)',
    description: 'Bài kiểm tra đánh giá năng lực lập trình cơ bản: Nhập xuất dữ liệu, Cấu trúc rẽ nhánh, Vòng lặp và Mảng một chiều.',
    start_time: '2026-08-30T00:00:00Z',
    end_time: '2026-09-15T23:59:59Z',
    duration_minutes: 60,
    created_by: 'usr_admin_1',
    created_by_name: 'Thầy Nguyễn Văn An',
    created_at: '2026-08-30T08:00:00Z',
    is_published: true,
    allow_view_result: true,
    problems: [
      { problem_id: 'prob_1', score: 20 },
      { problem_id: 'prob_2', score: 30 },
      { problem_id: 'prob_3', score: 20 },
      { problem_id: 'prob_4', score: 30 },
    ],
    total_score: 100,
    target_classes: ['10A1', '10A2'],
  },
  {
    id: 'exam_2',
    title: 'Đấu trường Thuật toán Nâng cao - Mùa 1',
    description: 'Kỳ thi thử dành cho đội tuyển Học sinh giỏi Tin học với các bài toán Binary Search, Dynamic Programming và Prefix Sum.',
    start_time: '2026-08-25T08:00:00Z',
    end_time: '2026-09-30T23:59:59Z',
    duration_minutes: 90,
    created_by: 'usr_admin_1',
    created_by_name: 'Thầy Nguyễn Văn An',
    created_at: '2026-08-25T08:00:00Z',
    is_published: true,
    allow_view_result: true,
    problems: [
      { problem_id: 'prob_6', score: 25 },
      { problem_id: 'prob_7', score: 25 },
      { problem_id: 'prob_8', score: 25 },
      { problem_id: 'prob_9', score: 25 },
    ],
    total_score: 100,
    target_classes: ['11 Chuyên Tin', '12 Tin'],
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    user_id: 'usr_std_2',
    user_name: 'Lê Thị Mai Hoa',
    user_class: '11 Chuyên Tin',
    problem_id: 'prob_9',
    problem_title: 'Dãy con tăng dài nhất (Longest Increasing Subsequence)',
    language: 'cpp',
    source_code: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];\n        vector<int> lis;\n        for (int x : a) {\n            auto it = lower_bound(lis.begin(), lis.end(), x);\n            if (it == lis.end()) lis.push_back(x);\n            else *it = x;\n        }\n        cout << lis.size() << endl;\n    }\n    return 0;\n}`,
    status: 'ACCEPTED',
    execution_time: 42,
    memory_used: 3200,
    test_cases_passed: 4,
    total_test_cases: 4,
    created_at: '2026-08-30T14:20:00Z',
  },
  {
    id: 'sub_2',
    user_id: 'usr_std_1',
    user_name: 'Nguyễn Văn Nam',
    user_class: '10A1',
    problem_id: 'prob_1',
    problem_title: 'Tính tổng hai số nguyên A và B',
    language: 'python',
    source_code: `a, b = map(int, input().split())\nprint(a + b)`,
    status: 'ACCEPTED',
    execution_time: 25,
    memory_used: 1240,
    test_cases_passed: 5,
    total_test_cases: 5,
    created_at: '2026-08-30T15:05:00Z',
  },
  {
    id: 'sub_3',
    user_id: 'usr_std_1',
    user_name: 'Nguyễn Văn Nam',
    user_class: '10A1',
    problem_id: 'prob_2',
    problem_title: 'Kiểm tra năm nhuận (Leap Year)',
    language: 'python',
    source_code: `year = int(input())\nif year % 4 == 0:\n    print("YES")\nelse:\n    print("NO")`,
    status: 'WRONG_ANSWER',
    execution_time: 28,
    memory_used: 1250,
    test_cases_passed: 4,
    total_test_cases: 6,
    error_details: 'Sai ở trường hợp năm 1900 (chia hết cho 100 nhưng không chia hết cho 400).',
    created_at: '2026-08-30T15:10:00Z',
  },
  {
    id: 'sub_4',
    user_id: 'usr_std_5',
    user_name: 'Hoàng Đức Duy',
    user_class: '12 Tin',
    problem_id: 'prob_8',
    problem_title: 'Tìm kiếm phần tử trong mảng đã sắp xếp',
    language: 'cpp',
    source_code: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, q;\n    if (cin >> n >> q) {\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];\n        while (q--) {\n            long long x;\n            cin >> x;\n            auto it = lower_bound(a.begin(), a.end(), x);\n            if (it != a.end() && *it == x) cout << (it - a.begin() + 1) << "\\n";\n            else cout << -1 << "\\n";\n        }\n    }\n    return 0;\n}`,
    status: 'ACCEPTED',
    execution_time: 35,
    memory_used: 2800,
    test_cases_passed: 3,
    total_test_cases: 3,
    created_at: '2026-08-30T16:00:00Z',
  },
  {
    id: 'sub_5',
    user_id: 'usr_std_3',
    user_name: 'Trần Minh Quang',
    user_class: '11 Chuyên Tin',
    problem_id: 'prob_7',
    problem_title: 'Kiểm tra dãy ngoặc đúng (Valid Parentheses)',
    language: 'python',
    source_code: `s = input().strip()\nst = []\nok = True\nm = {')':'(', ']':'[', '}':'{'}\nfor c in s:\n    if c in m.values(): st.append(c)\n    elif c in m:\n        if not st or st[-1] != m[c]:\n            ok = False\n            break\n        st.pop()\nprint("YES" if ok and not st else "NO")`,
    status: 'ACCEPTED',
    execution_time: 30,
    memory_used: 1300,
    test_cases_passed: 6,
    total_test_cases: 6,
    created_at: '2026-08-30T16:45:00Z',
  },
];

export const INITIAL_EXAM_PARTICIPANTS: ExamParticipant[] = [
  {
    id: 'ep_1',
    exam_id: 'exam_1',
    student_id: 'usr_std_1',
    student_name: 'Nguyễn Văn Nam',
    student_class: '10A1',
    started_at: '2026-08-30T09:00:00Z',
    submitted_at: '2026-08-30T09:45:00Z',
    total_score: 70,
    status: 'SUBMITTED',
    problem_submissions: {
      prob_1: {
        problem_id: 'prob_1',
        submission_id: 'sub_2',
        score_obtained: 20,
        status: 'ACCEPTED',
        submitted_at: '2026-08-30T09:10:00Z',
      },
      prob_2: {
        problem_id: 'prob_2',
        submission_id: 'sub_3',
        score_obtained: 0,
        status: 'WRONG_ANSWER',
        submitted_at: '2026-08-30T09:20:00Z',
      },
      prob_3: {
        problem_id: 'prob_3',
        submission_id: 'sub_exam_p3',
        score_obtained: 20,
        status: 'ACCEPTED',
        submitted_at: '2026-08-30T09:30:00Z',
      },
      prob_4: {
        problem_id: 'prob_4',
        submission_id: 'sub_exam_p4',
        score_obtained: 30,
        status: 'ACCEPTED',
        submitted_at: '2026-08-30T09:42:00Z',
      },
    },
  },
  {
    id: 'ep_2',
    exam_id: 'exam_2',
    student_id: 'usr_std_2',
    student_name: 'Lê Thị Mai Hoa',
    student_class: '11 Chuyên Tin',
    started_at: '2026-08-28T14:00:00Z',
    submitted_at: '2026-08-28T15:15:00Z',
    total_score: 100,
    status: 'SUBMITTED',
    problem_submissions: {
      prob_6: { problem_id: 'prob_6', submission_id: 's6', score_obtained: 25, status: 'ACCEPTED', submitted_at: '2026-08-28T14:15:00Z' },
      prob_7: { problem_id: 'prob_7', submission_id: 's7', score_obtained: 25, status: 'ACCEPTED', submitted_at: '2026-08-28T14:35:00Z' },
      prob_8: { problem_id: 'prob_8', submission_id: 's8', score_obtained: 25, status: 'ACCEPTED', submitted_at: '2026-08-28T14:55:00Z' },
      prob_9: { problem_id: 'prob_9', submission_id: 's9', score_obtained: 25, status: 'ACCEPTED', submitted_at: '2026-08-28T15:12:00Z' },
    },
  },
];
