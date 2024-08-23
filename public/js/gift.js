(() => {
    const $ = document.querySelector.bind(document);

    let timeRotate = 7000; 
    let currentRotate = 0;
    let isRotating = false;
    const wheel = $('.wheel');
    const btnWheel = $('.btn--wheel');
    const showMsg = $('.msg');

    // Danh sách phần thưởng với hình ảnh
    const listGift = [
        {
            text: 'Sạc dự phòng 10.000W',
            percent: 10 / 100,
            img: 'http://localhost:8080/images/review-item1.jpg', 
        },
        {
            text: 'Wave Alpha 110',
            percent: 10 / 100,
            img: 'images/review-item2.jpg', 
        },
        {
            text: 'Quay thêm lượt',
            percent: 5 / 100,
            img: 'images/review-item1.jpg', 
        },
        {
            text: 'Tai nghe không dây',
            percent: 5 / 100,
            img: 'images/review-item1.jpg', 
        },
        {
            text: 'Iphone 13',
            percent: 40 / 100,
            img: 'images/review-item1.jpg', 
        },
        {
            text: '5.000.000đ',
            percent: 20 / 100,
            img: 'images/review-item2.jpg', 
        },
    ];

    // Số lượng phần thưởng
    const size = listGift.length;

    // Số đo góc của 1 phần thưởng chiếm trên hình tròn
    const rotate = 360 / size;

    // Số đo góc cần để tạo độ nghiêng, 90 độ trừ đi góc của 1 phần thưởng chiếm
    const skewY = 90 - rotate;

    listGift.forEach((item, index) => {
        // Tạo thẻ li
        const elm = document.createElement('li');

        // Xoay và tạo độ nghiêng cho các thẻ li
        elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;

        // Thêm văn bản và hình ảnh vào thẻ li
        const textClasses = ['text-1', 'text-2'];
const textClass = textClasses[index % textClasses.length];

elm.innerHTML = `
    <p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg);" class="text ${textClass}">
        <b>${item.text}</b>
    </p>
    <img src="${item.img}" alt="${item.text}" class="image">
`;


        // Thêm vào thẻ ul
        wheel.appendChild(elm);
    });

    // Hàm bắt đầu
    const start = () => {
        showMsg.innerHTML = '';
        isRotating = true;
        // Lấy 1 số ngẫu nhiên 0 -> 1
        const random = Math.random();

        // Gọi hàm lấy phần thưởng
        const gift = getGift(random);

        // Số vòng quay: 360 độ = 1 vòng (Góc quay hiện tại)
        currentRotate += 360 * 10;

        // Gọi hàm quay
        rotateWheel(currentRotate, gift.index);

        // Gọi hàm in ra màn hình
        showGift(gift);
    };

    // Hàm quay vòng quay
    const rotateWheel = (currentRotate, index) => {
        $('.wheel').style.transform = `rotate(${
            // Góc quay hiện tại trừ góc của phần thưởng
            // Trừ tiếp cho một nửa góc của 1 phần thưởng để đưa mũi tên về chính giữa
            currentRotate - index * rotate - rotate / 2
        }deg)`;
    };

    // Hàm lấy phần thưởng, chỉ chọn hai phần thưởng cụ thể
    const getGift = randomNumber => {
        // Danh sách phần thưởng chỉ quay vào hai phần thưởng cụ thể
        const specialGifts = [          
            { text: 'Tai nghe không dây', index: listGift.findIndex(gift => gift.text === 'Tai nghe không dây') },
            { text: 'Tai nghe không dây', index: listGift.findIndex(gift => gift.text === 'Tai nghe không dây') }
        ];

        // Xác suất cho các phần thưởng đặc biệt
        const specialGiftsPercent = 0.5; // 50% cho mỗi phần thưởng đặc biệt

        // Chọn phần thưởng dựa trên số ngẫu nhiên
        const randomSpecial = Math.random();
        const selectedGift = specialGifts[Math.floor(randomSpecial * 2)];

        return selectedGift;
    };

    // In phần thưởng ra màn hình
    const showGift = gift => {
        let timer = setTimeout(() => {
            isRotating = false;

            showMsg.innerHTML = `Chúc mừng bạn đã nhận được "${listGift[gift.index].text}"`;

            clearTimeout(timer);
        }, timeRotate);
    };

    // Sự kiện click button start
    btnWheel.addEventListener('click', () => {
        !isRotating && start();
    });
})();
