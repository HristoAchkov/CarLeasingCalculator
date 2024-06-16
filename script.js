document.addEventListener('DOMContentLoaded', () => {
    const carValueText = document.getElementById('carValueText');
    const carValueRange = document.getElementById('carValueRange');
    const leaseText = document.getElementById('leaseText');
    const downPaymentText = document.getElementById('downPaymentText');
    const downPaymentRange = document.getElementById('downPaymentInput');
    const condition = document.getElementById('condition');

    carValueText.addEventListener('input', () => {
        carValueRange.value = carValueText.value;
        carValueText.setCustomValidity('');
        updateLeasingDetails();
    });

    carValueRange.addEventListener('input', () => {
        carValueText.value = carValueRange.value;
        updateLeasingDetails();
    });

    leaseText.addEventListener('change', () => {
        updateLeasingDetails();
    });

    downPaymentText.addEventListener('input', () => {
        downPaymentRange.value = downPaymentText.value;
        downPaymentText.setCustomValidity('');
        updateLeasingDetails();
    });

    downPaymentRange.addEventListener('input', () => {
        downPaymentText.value = downPaymentRange.value;
        updateLeasingDetails();
    });

    condition.addEventListener('change', () => {
        updateInterestRate();
        updateLeasingDetails();
    });

    function validateValue(input, minValue, maxValue, errorMessage) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < minValue || value > maxValue) {
            input.setCustomValidity(errorMessage);
            input.value = Math.max(minValue, Math.min(maxValue, value));
        } else {
            input.setCustomValidity('');
        }
        input.reportValidity();
        updateLeasingDetails();
    }

    carValueText.addEventListener('blur', () => validateValue(carValueText, 10000, 200000, 'Car value must be between €10,000 and €200,000.'));
    downPaymentText.addEventListener('blur', () => validateValue(downPaymentText, 10, 50, 'Down payment must be between 10% and 50%.'));

    function updateLeasingDetails() {
        let carValue = parseFloat(carValueText.value) || 0;
        let leaseMonths = parseInt(leaseText.value) || 0;
        let downPaymentPercentage = parseFloat(downPaymentRange.value) || 0;
        let annualInterestRate = condition.value === '1' ? 2.99 : 3.7;

        let leasingDetails = calculateLeasingCost(carValue, downPaymentPercentage, leaseMonths, annualInterestRate);

        document.getElementById('downPaymentValue').textContent = '€' + leasingDetails.downPayment.toFixed(2);
        document.getElementById('totalLeasingCost').textContent = '€' + leasingDetails.totalLeasingCost.toFixed(2);
        document.getElementById('monthlyInstallment').textContent = '€' + leasingDetails.monthlyInstallment.toFixed(2);
    }

    function updateInterestRate() {
        document.getElementById('interestRate').textContent = condition.value === '1' ? '2.99%' : '3.7%';
    }

    function calculateLeasingCost(carValue, downPaymentPercentage, leasePeriodMonths, annualInterestRate) {
        let downPayment = carValue * (downPaymentPercentage / 100);
        let amountFinanced = carValue - downPayment;
        let monthlyInterestRate = annualInterestRate / (12 * 100);
        let n = leasePeriodMonths;
        let r = monthlyInterestRate;
        let P = amountFinanced;
        let EMI = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        let totalLeasingCost = (EMI * n) + downPayment;

        return {
            downPayment: downPayment,
            monthlyInstallment: EMI,
            totalLeasingCost: totalLeasingCost
        };
    }

    updateInterestRate();
    updateLeasingDetails();
});
