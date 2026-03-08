const fs = require('fs');
const path = 'D:/C#Study/Demos/median.html'.replace('D:/','E:/'.replace('D:/','E:/'));
let content = fs.readFileSync(path, 'utf8');
const script = String.raw`<script>
    const codeLines = [
        "public class Solution",
        "{",
        "    public double FindMedianSortedArrays(int[] nums1, int[] nums2)",
        "    {",
        "        if (nums1.Length > nums2.Length)",
        "        {",
        "            return FindMedianSortedArrays(nums2, nums1);",
        "        }",
        "",
        "        int m = nums1.Length;",
        "        int n = nums2.Length;",
        "        int left = 0;",
        "        int right = m;",
        "",
        "        while (left <= right)",
        "        {",
        "            int i = (left + right) / 2;",
        "            int j = (m + n + 1) / 2 - i;",
        "",
        "            int nums1Left = (i == 0) ? int.MinValue : nums1[i - 1];",
        "            int nums1Right = (i == m) ? int.MaxValue : nums1[i];",
        "            int nums2Left = (j == 0) ? int.MinValue : nums2[j - 1];",
        "            int nums2Right = (j == n) ? int.MaxValue : nums2[j];",
        "",
        "            if (nums1Left <= nums2Right && nums2Left <= nums1Right)",
        "            {",
        "                if ((m + n) % 2 == 1)",
        "                {",
        "                    return Math.Max(nums1Left, nums2Left);",
        "                }",
        "",
        "                return (Math.Max(nums1Left, nums2Left) +",
        "                        Math.Min(nums1Right, nums2Right)) / 2.0;",
        "            }",
        "",
        "            if (nums1Left > nums2Right)",
        "            {",
        "                right = i - 1;",
        "            }",
        "            else",
        "            {",
        "                left = i + 1;",
        "            }",
        "        }",
        "",
        "        return 0;",
        "    }",
        "}"
    ];

    const nums1Input = document.getElementById("nums1Input");
    const nums2Input = document.getElementById("nums2Input");
    const len1Input = document.getElementById("len1Input");
    const len2Input = document.getElementById("len2Input");
    const randomBtn = document.getElementById("randomBtn");
    const sampleBtn = document.getElementById("sampleBtn");
    const buildBtn = document.getElementById("buildBtn");
    const playBtn = document.getElementById("playBtn");
    const stepBtn = document.getElementById("stepBtn");
    const resetBtn = document.getElementById("resetBtn");
    const speedRange = document.getElementById("speedRange");
    const speedValue = document.getElementById("speedValue");
    const errorBox = document.getElementById("errorBox");
    const stepList = document.getElementById("stepList");
    const arrayA = document.getElementById("arrayA");
    const arrayB = document.getElementById("arrayB");
    const cutValue = document.getElementById("cutValue");
    const cutSub = document.getElementById("cutSub");
    const leftCountValue = document.getElementById("leftCountValue");
    const targetLeftCount = document.getElementById("targetLeftCount");
    const compareValue = document.getElementById("compareValue");
    const compareSub = document.getElementById("compareSub");
    const medianValue = document.getElementById("medianValue");
    const medianSub = document.getElementById("medianSub");
    const formulaBox = document.getElementById("formulaBox");
    const stepExplain = document.getElementById("stepExplain");
    const beginnerExplain = document.getElementById("beginnerExplain");
    const resultBig = document.getElementById("resultBig");
    const resultExplain = document.getElementById("resultExplain");
    const codeBlock = document.getElementById("codeBlock");
    const codeExplain = document.getElementById("codeExplain");
    const simpleModeBtn = document.getElementById("simpleModeBtn");
    const proModeBtn = document.getElementById("proModeBtn");
    const modeHint = document.getElementById("modeHint");

    let state = { steps: [], index: 0, timer: null, mode: "simple" };

    function parseArray(text) {
        const trimmed = text.trim();
        if (trimmed === "") return [];
        const parts = trimmed.split(",").map(part => part.trim()).filter(Boolean);
        const nums = parts.map(part => {
            if (!/^-?\d+$/.test(part)) throw new Error("Only integers are allowed. Example: 1, 3, 8");
            return Number(part);
        });
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] < nums[i - 1]) throw new Error("Arrays must already be sorted in non-decreasing order.");
        }
        return nums;
    }

    function randomSortedArray(length) {
        const arr = [];
        let current = Math.floor(Math.random() * 4) - 2;
        for (let i = 0; i < length; i++) {
            current += Math.floor(Math.random() * 4);
            arr.push(current);
        }
        return arr;
    }

    function arraysToText(arr) { return arr.join(", "); }
    function formatBoundaryValue(value) { if (value === Number.NEGATIVE_INFINITY) return "-inf"; if (value === Number.POSITIVE_INFINITY) return "+inf"; return String(value); }

    function buildSteps(raw1, raw2) {
        let a = raw1.slice();
        let b = raw2.slice();
        const steps = [];
        let swapped = false;
        if (a.length > b.length) { [a, b] = [b, a]; swapped = true; }
        const m = a.length;
        const n = b.length;
        const leftTarget = Math.floor((m + n + 1) / 2);
        if (m === 0 && n === 0) throw new Error("At least one array must be non-empty.");
        if (swapped) steps.push({ phase: "swap", a, b, swapped, leftTarget });
        let left = 0;
        let right = m;
        while (left <= right) {
            const i = Math.floor((left + right) / 2);
            const j = leftTarget - i;
            const Aleft = i === 0 ? Number.NEGATIVE_INFINITY : a[i - 1];
            const Aright = i === m ? Number.POSITIVE_INFINITY : a[i];
            const Bleft = j === 0 ? Number.NEGATIVE_INFINITY : b[j - 1];
            const Bright = j === n ? Number.POSITIVE_INFINITY : b[j];
            const valid = Aleft <= Bright && Bleft <= Aright;
            const goLeft = Aleft > Bright;
            const odd = (m + n) % 2 === 1;
            const median = valid ? (odd ? Math.max(Aleft, Bleft) : (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2.0) : null;
            steps.push({ phase: valid ? (odd ? "foundOdd" : "foundEven") : (goLeft ? "moveLeft" : "moveRight"), a, b, swapped, leftTarget, left, right, i, j, Aleft, Aright, Bleft, Bright, valid, goLeft, odd, median });
            if (valid) break;
            if (goLeft) right = i - 1; else left = i + 1;
        }
        return steps;
    }

    function getCodeInfo(step) {
        switch (step.phase) {
            case "swap": return { lines: [5, 6, 7, 8], text: "First make sure nums1 is the shorter array." };
            case "moveLeft": return { lines: [15, 17, 18, 20, 21, 22, 23, 35, 36, 37, 38], text: "i is too large, so move the cut to the left." };
            case "moveRight": return { lines: [15, 17, 18, 20, 21, 22, 23, 39, 40, 41], text: "i is too small, so move the cut to the right." };
            case "foundOdd": return { lines: [15, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 29], text: "Valid cut found. Odd total length uses the max on the left side." };
            case "foundEven": return { lines: [15, 17, 18, 20, 21, 22, 23, 25, 31, 32, 33], text: "Valid cut found. Even total length uses average of left max and right min." };
            default: return { lines: [], text: "Waiting to start." };
        }
    }

    function describeStep(step, index, total) {
        if (step.phase === "swap") return { title: `Step ${index + 1} / ${total}`, desc: "Preprocess first: place the shorter array on top for binary search." };
        let desc = `Try cut i=${step.i} in the short array and j=${step.j} in the long array.`;
        if (step.valid) desc += " Both cross-boundary checks pass, so the cut is valid.";
        else if (step.goLeft) desc += ` Aleft=${formatBoundaryValue(step.Aleft)} is greater than Bright=${formatBoundaryValue(step.Bright)}, so i must move left.`;
        else desc += ` Bleft=${formatBoundaryValue(step.Bleft)} is greater than Aright=${formatBoundaryValue(step.Aright)}, so i must move right.`;
        return { title: `Step ${index + 1} / ${total}`, desc };
    }

    function getBeginnerText(step) {
        if (step.phase === "swap") return "先把短数组放上面。因为每次只在一个数组上试切点，选短的那个范围更小。";
        if (step.valid) return step.odd
            ? `这次已经切对了，而且总长度是奇数，所以中位数就是左边最大的那个数：${Math.max(step.Aleft, step.Bleft)}。`
            : `这次已经切对了，而且总长度是偶数，所以看左边最大和右边最小：${Math.max(step.Aleft, step.Bleft)} 和 ${Math.min(step.Aright, step.Bright)}。`;
        if (step.goLeft) return `这刀切得太靠右。因为短数组左边最后一个数 ${formatBoundaryValue(step.Aleft)} 比长数组右边第一个数 ${formatBoundaryValue(step.Bright)} 还大。`;
        return `这刀切得太靠左。因为长数组左边最后一个数 ${formatBoundaryValue(step.Bleft)} 比短数组右边第一个数 ${formatBoundaryValue(step.Aright)} 还大。`;
    }

    function getFormulaText(step) {
        if (step.phase === "swap") return "先保证 m <= n，然后只在短数组上二分。";
        return `左边元素个数固定为 (m + n + 1) / 2 = ${step.leftTarget}；当前边界值是 Aleft=${formatBoundaryValue(step.Aleft)}、Aright=${formatBoundaryValue(step.Aright)}、Bleft=${formatBoundaryValue(step.Bleft)}、Bright=${formatBoundaryValue(step.Bright)}。`;
    }

    function renderCode(activeLines, explanation) {
        codeBlock.innerHTML = "";
        const activeSet = new Set(activeLines);
        codeLines.forEach((line, idx) => {
            const row = document.createElement("div");
            row.className = "code-line";
            if (activeSet.size > 0) row.classList.add(activeSet.has(idx + 1) ? "active" : "dimmed");
            const no = document.createElement("div");
            no.className = "line-no";
            no.textContent = idx + 1;
            const text = document.createElement("div");
            text.className = "line-text";
            text.textContent = line || " ";
            row.appendChild(no);
            row.appendChild(text);
            codeBlock.appendChild(row);
        });
        codeExplain.textContent = explanation;
    }

    function renderArray(container, arr, cut, focusLeftIndex, focusRightIndex) {
        container.innerHTML = "";
        for (let boundary = 0; boundary <= arr.length; boundary++) {
            const divider = document.createElement("div");
            divider.className = "boundary" + (boundary === cut ? " active" : "");
            container.appendChild(divider);
            if (boundary === arr.length) continue;
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = boundary;
            cell.classList.add(boundary < cut ? "left-side" : "right-side");
            if (boundary === focusLeftIndex) cell.classList.add("focus-left");
            if (boundary === focusRightIndex) cell.classList.add("focus-right");
            const num = document.createElement("div");
            num.className = "num";
            num.textContent = arr[boundary];
            cell.appendChild(num);
            container.appendChild(cell);
        }
    }

    function renderStepList() {
        stepList.innerHTML = "";
        state.steps.forEach((step, idx) => {
            const meta = describeStep(step, idx, state.steps.length);
            const item = document.createElement("div");
            item.className = "step" + (idx === state.index ? " active" : "");
            item.innerHTML = `<div class="step-title">${meta.title}</div><div class="step-desc">${meta.desc}</div>`;
            stepList.appendChild(item);
        });
    }

    function resetVisual() {
        stepList.innerHTML = "";
        arrayA.innerHTML = "";
        arrayB.innerHTML = "";
        cutValue.textContent = "i = -, j = -";
        cutSub.textContent = "Click build steps first.";
        leftCountValue.textContent = "-";
        targetLeftCount.textContent = "-";
        compareValue.textContent = "-";
        compareSub.textContent = "Waiting for steps";
        medianValue.textContent = "-";
        medianSub.textContent = "Appears after a valid cut is found";
        formulaBox.innerHTML = "左边元素总数固定为 <strong>(m + n + 1) / 2</strong>。<br>当满足 <strong>Aleft &lt;= Bright</strong> 且 <strong>Bleft &lt;= Aright</strong> 时，说明切分正确。";
        stepExplain.textContent = "Build steps first, then inspect how each move changes i and j.";
        beginnerExplain.textContent = "我会用更口语的话解释当前这一步。你可以切换到公式模式，看更紧凑的表达。";
        resultBig.textContent = "-";
        resultExplain.textContent = "Odd length uses left max. Even length uses average of left max and right min.";
        renderCode([], "This box explains why the highlighted code is running.");
    }

    function renderCurrentStep() {
        if (!state.steps.length) return;
        const step = state.steps[state.index];
        renderStepList();
        if (step.phase === "swap") {
            renderArray(arrayA, step.a, 0, -1, 0);
            renderArray(arrayB, step.b, 0, -1, 0);
            cutValue.textContent = "Preprocess";
            cutSub.textContent = "Make the top array shorter first";
            leftCountValue.textContent = "-";
            targetLeftCount.textContent = String(step.leftTarget);
            compareValue.textContent = "-";
            compareSub.textContent = "Real cut testing starts next step";
            medianValue.textContent = "-";
            medianSub.textContent = "Appears after a valid cut is found";
            resultBig.textContent = "-";
            resultExplain.textContent = "This is only preprocessing.";
        } else {
            renderArray(arrayA, step.a, step.i, step.i - 1, step.i);
            renderArray(arrayB, step.b, step.j, step.j - 1, step.j);
            cutValue.textContent = `i = ${step.i}, j = ${step.j}`;
            cutSub.textContent = step.swapped ? "Input arrays were swapped so the top one is shorter." : "The top array is already the shorter one.";
            leftCountValue.textContent = `${step.i + step.j}`;
            targetLeftCount.textContent = String(step.leftTarget);
            compareValue.textContent = `${formatBoundaryValue(step.Aleft)} <= ${formatBoundaryValue(step.Bright)} / ${formatBoundaryValue(step.Bleft)} <= ${formatBoundaryValue(step.Aright)}`;
            if (step.valid) {
                compareSub.textContent = "Both checks pass. The cut is valid.";
                medianValue.textContent = String(step.median);
                medianSub.textContent = step.odd ? "Odd total length: use left-side max." : "Even total length: average left max and right min.";
                resultBig.textContent = String(step.median);
                resultExplain.textContent = medianSub.textContent;
            } else if (step.goLeft) {
                compareSub.textContent = "Aleft is too large, so i must move left.";
                medianValue.textContent = "-";
                medianSub.textContent = "Still searching";
                resultBig.textContent = "-";
                resultExplain.textContent = "The short array takes too many values on the left side.";
            } else {
                compareSub.textContent = "Bleft is too large, so i must move right.";
                medianValue.textContent = "-";
                medianSub.textContent = "Still searching";
                resultBig.textContent = "-";
                resultExplain.textContent = "The short array takes too few values on the left side.";
            }
        }
        formulaBox.innerHTML = state.mode === "simple" ? `Current core rule: <strong>${getFormulaText(step)}</strong>` : getFormulaText(step);
        stepExplain.textContent = describeStep(step, state.index, state.steps.length).desc;
        beginnerExplain.textContent = getBeginnerText(step);
        const codeInfo = getCodeInfo(step);
        renderCode(codeInfo.lines, codeInfo.text);
    }

    function stopPlay() {
        if (state.timer !== null) {
            clearInterval(state.timer);
            state.timer = null;
            playBtn.textContent = "Auto play";
        }
    }

    function build() {
        stopPlay();
        errorBox.textContent = "";
        try {
            const raw1 = parseArray(nums1Input.value);
            const raw2 = parseArray(nums2Input.value);
            state.steps = buildSteps(raw1, raw2);
            state.index = 0;
            renderCurrentStep();
        } catch (error) {
            state.steps = [];
            state.index = 0;
            errorBox.textContent = error.message;
            resetVisual();
        }
    }

    function nextStep() {
        if (!state.steps.length) { build(); if (!state.steps.length) return; }
        if (state.index < state.steps.length - 1) { state.index += 1; renderCurrentStep(); }
        else { stopPlay(); }
    }

    function resetStep() {
        stopPlay();
        if (!state.steps.length) { build(); return; }
        state.index = 0;
        renderCurrentStep();
    }

    function togglePlay() {
        if (!state.steps.length) { build(); if (!state.steps.length) return; }
        if (state.timer !== null) { stopPlay(); return; }
        playBtn.textContent = "Pause";
        state.timer = setInterval(() => {
            if (state.index >= state.steps.length - 1) { stopPlay(); return; }
            nextStep();
        }, Number(speedRange.value));
    }

    function setMode(mode) {
        state.mode = mode;
        simpleModeBtn.classList.toggle("active", mode === "simple");
        proModeBtn.classList.toggle("active", mode === "pro");
        modeHint.textContent = mode === "simple"
            ? "Current mode prefers plain-language explanations."
            : "Current mode prefers compact formula-based explanations.";
        if (state.steps.length) renderCurrentStep();
    }

    randomBtn.addEventListener("click", () => {
        const len1 = Math.max(0, Math.min(12, Number(len1Input.value) || 0));
        const len2 = Math.max(0, Math.min(12, Number(len2Input.value) || 0));
        if (len1 === 0 && len2 === 0) {
            errorBox.textContent = "At least one array length must be greater than 0.";
            return;
        }
        nums1Input.value = arraysToText(randomSortedArray(len1));
        nums2Input.value = arraysToText(randomSortedArray(len2));
        build();
    });

    sampleBtn.addEventListener("click", () => {
        nums1Input.value = "1, 2";
        nums2Input.value = "3, 4";
        build();
    });

    buildBtn.addEventListener("click", build);
    playBtn.addEventListener("click", togglePlay);
    stepBtn.addEventListener("click", nextStep);
    resetBtn.addEventListener("click", resetStep);
    simpleModeBtn.addEventListener("click", () => setMode("simple"));
    proModeBtn.addEventListener("click", () => setMode("pro"));
    speedRange.addEventListener("input", () => {
        speedValue.textContent = `${speedRange.value}ms`;
        if (state.timer !== null) { stopPlay(); togglePlay(); }
    });

    resetVisual();
    build();
</script>`;
content = content.replace(/<script>[\s\S]*?<\/script>/, script);
fs.writeFileSync(path, content, 'utf8');
