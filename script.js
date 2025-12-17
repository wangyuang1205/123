class SalaryCalculator {
    constructor() {
        this.monthlySalary = 0;
        this.dailyHours = 0;
        this.hourlyRate = 0;
        this.secondlyRate = 0;
        this.isWorking = false;
        this.startTime = null;
        this.timer = null;
        this.earnedToday = 0;
        
        this.initElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initElements() {
        this.monthlySalaryInput = document.getElementById('monthlySalary');
        this.dailyHoursInput = document.getElementById('dailyHours');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.hourlyRateDisplay = document.getElementById('hourlyRate');
        this.secondlyRateDisplay = document.getElementById('secondlyRate');
        this.workTimeDisplay = document.getElementById('workTime');
        this.earnedTodayDisplay = document.getElementById('earnedToday');
        this.coinContainer = document.getElementById('coinContainer');
    }
    
    bindEvents() {
        this.monthlySalaryInput.addEventListener('input', () => this.calculateRates());
        this.dailyHoursInput.addEventListener('input', () => this.calculateRates());
        this.startBtn.addEventListener('click', () => this.startWorking());
        this.stopBtn.addEventListener('click', () => this.stopWorking());
    }
    
    calculateRates() {
        this.monthlySalary = parseFloat(this.monthlySalaryInput.value) || 0;
        this.dailyHours = parseFloat(this.dailyHoursInput.value) || 0;
        
        // 假设一个月工作22天
        const monthlyWorkDays = 22;
        const monthlyWorkHours = this.dailyHours * monthlyWorkDays;
        
        this.hourlyRate = monthlyWorkHours > 0 ? this.monthlySalary / monthlyWorkHours : 0;
        this.secondlyRate = this.hourlyRate / 3600;
        
        this.updateDisplay();
    }
    
    startWorking() {
        if (this.monthlySalary <= 0 || this.dailyHours <= 0) {
            alert('请先输入有效的月薪和每日工作时间！');
            return;
        }
        
        this.isWorking = true;
        this.startTime = Date.now();
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.earnedToday = 0;
        
        this.startTimer();
        this.startCoinAnimation();
    }
    
    stopWorking() {
        this.isWorking = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (this.coinInterval) {
            clearInterval(this.coinInterval);
            this.coinInterval = null;
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            this.earnedToday = this.secondlyRate * (elapsedTime / 1000);
            this.updateDisplay(elapsedTime);
        }, 100); // 每100毫秒更新一次
    }
    
    startCoinAnimation() {
        this.coinInterval = setInterval(() => {
            this.createCoin();
        }, 500); // 每500毫秒生成一个金币
    }
    
    createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        
        // 随机位置
        const left = Math.random() * (this.coinContainer.offsetWidth - 30);
        coin.style.left = left + 'px';
        
        // 随机大小
        const size = Math.random() * 10 + 25;
        coin.style.width = size + 'px';
        coin.style.height = size + 'px';
        coin.style.lineHeight = size + 'px';
        
        // 随机旋转角度
        const rotation = Math.random() * 360;
        coin.style.transform = `translateY(-100px) rotate(${rotation}deg) scale(0)`;
        
        this.coinContainer.appendChild(coin);
        
        // 动画结束后移除金币
        setTimeout(() => {
            if (coin.parentNode) {
                coin.parentNode.removeChild(coin);
            }
        }, 3000);
    }
    
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay(elapsedTime = 0) {
        this.hourlyRateDisplay.textContent = this.hourlyRate.toFixed(2) + ' 元';
        this.secondlyRateDisplay.textContent = this.secondlyRate.toFixed(4) + ' 元';
        
        if (this.isWorking) {
            this.workTimeDisplay.textContent = this.formatTime(elapsedTime);
            this.earnedTodayDisplay.textContent = this.earnedToday.toFixed(2) + ' 元';
            
            // 添加脉冲动画效果
            this.earnedTodayDisplay.classList.add('pulse');
            setTimeout(() => {
                this.earnedTodayDisplay.classList.remove('pulse');
            }, 500);
        } else {
            this.workTimeDisplay.textContent = '00:00:00';
            this.earnedTodayDisplay.textContent = '0.00 元';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SalaryCalculator();
});