import type { AppData, Scenario, Choice } from '../types'
import { GAME_CONFIG } from '../constants/game'

export const STORAGE_KEY = 'tam-ly-hoc-data'
export const ADMIN_SESSION_KEY = 'tam-ly-hoc-admin-session'
export const DEFAULT_ADMIN_PASSWORD = 'admin123'

function sc(
  age: number,
  slot: number,
  title: string,
  situation: string,
  choices: Omit<Choice, 'id'>[],
): Scenario {
  return {
    id: `age${age}-th${slot}`,
    age,
    slot,
    title,
    situation,
    choices: choices.map((c, i) => ({
      ...c,
      id: `age${age}-th${slot}-c${i}`,
    })),
  }
}

const sampleScenarios: Scenario[] = [
  sc(5, 1, 'Con không muốn đi học', 'Bé 5 tuổi khóc nức nở, ôm chặt chân mẹ và nói "Con không muốn đi học" vào sáng thứ Hai.', [
    { text: 'Ôm con, hỏi con sợ điều gì ở trường', result: 'Con cảm thấy được lắng nghe và dần chia sẻ vì sợ bạn không chơi cùng.', emotionDelta: 3, logicDelta: 1 },
    { text: 'Nói "Đi học là bắt buộc, không được khóc"', result: 'Con nín khóc nhưng căng thẳng, có thể tái diễn sáng hôm sau.', emotionDelta: -2, logicDelta: 1 },
    { text: 'Hứa cho quà nếu con đi học ngoan', result: 'Con đi học hôm nay nhưng chưa giải quyết nỗi sợ bên trong.', emotionDelta: 0, logicDelta: -2 },
  ]),
  sc(5, 2, 'Con đánh bạn', 'Giáo viên báo bé đã đẩy bạn khi tranh đồ chơi. Con về nhà im lặng.', [
    { text: 'Ngồi xuống ngang tầm mắt, hỏi chuyện gì đã xảy ra', result: 'Con kể bạn giành đồ chơi mình đang chơi trước.', emotionDelta: 3, logicDelta: 2 },
    { text: 'Phạt con không xem hoạt hình tối nay', result: 'Con sợ hãi nhưng chưa hiểu cách xử lý cảm giác tức giận.', emotionDelta: -1, logicDelta: 0 },
    { text: 'Bỏ qua vì "con còn nhỏ"', result: 'Hành vi có thể lặp lại vì con chưa học cách kiểm soát cảm xúc.', emotionDelta: 1, logicDelta: -3 },
  ]),
  sc(8, 1, 'Điểm kém môn Toán', 'Con 8 tuổi giấu phiếu điểm 4 trong cặp vì sợ bị mắng.', [
    { text: 'Nói "Mẹ muốn biết chuyện gì xảy ra, không trách con ngay"', result: 'Con đưa phiếu và kể em không hiểu phép chia.', emotionDelta: 3, logicDelta: 2 },
    { text: 'So sánh với bạn học giỏi nhà hàng xóm', result: 'Con cảm thấy xấu hổ, mất tự tin hơn với môn Toán.', emotionDelta: -3, logicDelta: -1 },
    { text: 'Thuê gia sư ngay, tăng giờ học', result: 'Con học thêm nhưng chưa được giải tỏa nỗi sợ thất bại.', emotionDelta: 0, logicDelta: 1 },
  ]),
  sc(8, 2, 'Con nói dối', 'Bạn bè mách con nói dối đã làm hết bài tập dù chưa làm.', [
    { text: 'Hỏi con lý do nói dối mà không kết luận trước', result: 'Con thú nhận sợ bị coi là lười.', emotionDelta: 2, logicDelta: 2 },
    { text: 'Nói "Con là đứa trẻ nói dối"', result: 'Con tủi thân, có thể tiếp tục nói dối để tránh bị gán nhãn.', emotionDelta: -3, logicDelta: -1 },
    { text: 'Không nhắc lại, coi như không biết', result: 'Con không học được trách nhiệm giải trình.', emotionDelta: 1, logicDelta: -2 },
  ]),
  sc(12, 1, 'Bị bạn bè cô lập', 'Con 12 tuổi nói nhóm bạn không rủ ăn trưa, ngồi một mình suốt tuần.', [
    { text: 'Lắng nghe, hỏi con cảm thấy thế nào', result: 'Con bật khóc và kể bị trêu vì quần áo.', emotionDelta: 4, logicDelta: 1 },
    { text: 'Khuyên "Bỏ qua, họ không xứng làm bạn"', result: 'Con được an ủi nhưng chưa có kỹ năng xử lý xung đột.', emotionDelta: 1, logicDelta: -1 },
    { text: 'Gọi điện phụ huynh bạn đó ngay', result: 'Con xấu hổ, e ngại đến trường hơn.', emotionDelta: -2, logicDelta: 0 },
  ]),
  sc(12, 2, 'Mê game', 'Con chơi game đến 2 giờ sáng, ngủ gục trên bàn học.', [
    { text: 'Thỏa thuận lại giờ chơi cùng con', result: 'Con tham gia đặt luật và dần tự giám sát hơn.', emotionDelta: 2, logicDelta: 3 },
    { text: 'Tịch thu điện thoại một tháng', result: 'Con phản kháng, tìm cách chơi lén.', emotionDelta: -2, logicDelta: -1 },
    { text: 'Mắng và bỏ qua vì mệt', result: 'Thói quen có thể tiếp diễn, ảnh hưởng giấc ngủ và học tập.', emotionDelta: -1, logicDelta: -2 },
  ]),
  sc(16, 1, 'Áp lực thi đại học', 'Con 16 tuổi nói "Con không đủ giỏi" và muốn bỏ ôn thi.', [
    { text: 'Thừa nhận áp lực là bình thường, hỏi con cần hỗ trợ gì', result: 'Con bày tỏ muốn đổi phương pháp ôn, không phải bỏ cuộc.', emotionDelta: 3, logicDelta: 2 },
    { text: 'Nói gia đình đã đầu tư bao nhiêu tiền', result: 'Con thêm tội lỗi, có thể trầm cảm hơn.', emotionDelta: -3, logicDelta: -1 },
    { text: 'Sắp lịch ôn dày đặc để "ép" con tập trung', result: 'Con kiệt sức, hiệu quả học giảm.', emotionDelta: -1, logicDelta: 0 },
  ]),
  sc(16, 2, 'Yêu sớm', 'Con thừa nhận thích bạn cùng lớp và nhắn tin đến khuya.', [
    { text: 'Trò chuyện cởi mở về cảm xúc và ranh giới', result: 'Con chia sẻ thêm, chấp nhận quy định giờ ngủ.', emotionDelta: 3, logicDelta: 2 },
    { text: 'Cấm không được gặp bạn đó', result: 'Con có thể gặp lén, mất tin tưởng với phụ huynh.', emotionDelta: -2, logicDelta: -2 },
    { text: 'Coi là chuyện nhỏ, không cần quan tâm', result: 'Con thiếu hướng dẫn về quản lý cảm xúc và thời gian.', emotionDelta: 0, logicDelta: -2 },
  ]),
  sc(18, 1, 'Chọn ngành học', 'Con muốn học Mỹ thuật trong khi gia đình kỳ vọng Kinh tế.', [
    { text: 'Cùng con nghiên cứu cơ hội nghề nghiệp cả hai ngành', result: 'Cuộc trò chuyện dựa trên dữ kiện, con cảm thấy được tôn trọng.', emotionDelta: 2, logicDelta: 4 },
    { text: 'Khẳng định chỉ hỗ trợ nếu con học Kinh tế', result: 'Con cảm thấy bị kiểm soát, có thể nổi loạn hoặc im lặng.', emotionDelta: -3, logicDelta: -1 },
    { text: 'Để con tự quyết, không can thiệp', result: 'Con được tự do nhưng thiếu định hướng khi cần.', emotionDelta: 2, logicDelta: -1 },
  ]),
  sc(20, 1, 'Muốn sống riêng', 'Con 20 tuổi thông báo muốn dọn ra ở riêng sau khi tốt nghiệp.', [
    { text: 'Bàn kế hoạch tài chính và an toàn cùng con', result: 'Con thấy phụ huynh coi mình là người trưởng thành.', emotionDelta: 2, logicDelta: 3 },
    { text: 'Nói "Trong nhà này con phải nghe bố mẹ"', result: 'Xung đột gia đình leo thang, con cảm thấy bị bó buộc.', emotionDelta: -3, logicDelta: -2 },
    { text: 'Đồng ý ngay không hỏi thêm', result: 'Con độc lập nhưng có thể thiếu chuẩn bị thực tế.', emotionDelta: 1, logicDelta: -1 },
  ]),
]

export const defaultData: AppData = {
  title: 'Đồng Hành Cùng Trẻ',
  description:
    'Mỗi câu gắn với một độ tuổi của trẻ (5, 6, 7... đến 20). Hệ thống bốc ngẫu nhiên 1 trong 10 tình huống của tuổi đó. Mỗi lựa chọn ảnh hưởng điểm Tình cảm và Lý trí.',
  totalQuestions: GAME_CONFIG.TOTAL_QUESTIONS,
  minAge: GAME_CONFIG.MIN_AGE,
  maxAge: GAME_CONFIG.MAX_AGE,
  scenariosPerAge: GAME_CONFIG.SCENARIOS_PER_AGE,
  initialEmotionScore: GAME_CONFIG.INITIAL_EMOTION,
  initialLogicScore: GAME_CONFIG.INITIAL_LOGIC,
  scenarios: sampleScenarios,
}
