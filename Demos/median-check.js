
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

    let state = {
        steps: [],
        index: 0,
        timer: null,
        mode: "simple"
    };

    function parseArray(text) {
        const trimmed = text.trim();
        if (trimmed === "") return [];

        const parts = trimmed.split(",").map(part => part.trim()).filter(Boolean);
        const nums = parts.map(part => {
            if (!/^-?\d+$/.test(part)) {
                throw new Error("鏁扮粍閲屽彧鑳藉～鏁存暟锛屾牸寮忎緥瀛愶細1, 3, 8");
            }
            return Number(part);
        });

        for (let i = 1; i < nums.length; i++) {
            if (nums[i] < nums[i - 1]) {
                throw new Error("鏁扮粍蹇呴』宸茬粡鎸変粠灏忓埌澶ф帓濂藉簭銆?);
            }
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

    function arraysToText(arr) {
        return arr.join(", ");
    }

    function formatBoundaryValue(value) {
        if (value === Number.NEGATIVE_INFINITY) return "-inf";
        if (value === Number.POSITIVE_INFINITY) return "+inf";
        return String(value);
    }

    function buildSteps(raw1, raw2) {
        let a = raw1.slice();
        let b = raw2.slice();
        const steps = [];
        let swapped = false;

        if (a.length > b.length) {
            [a, b] = [b, a];
            swapped = true;
        }

        const m = a.length;
        const n = b.length;
        const leftTarget = Math.floor((m + n + 1) / 2);

        if (m === 0 && n === 0) {
            throw new Error("鑷冲皯瑕佹湁涓€涓暟缁勯潪绌恒€?);
        }

        if (swapped) {
            steps.push({
                phase: "swap",
                a,
                b,
                swapped,
                leftTarget
            });
        }

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
            const median = valid
                ? (odd ? Math.max(Aleft, Bleft) : (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2.0)
                : null;

            steps.push({
                phase: valid ? (odd ? "foundOdd" : "foundEven") : (goLeft ? "moveLeft" : "moveRight"),
                a,
                b,
                swapped,
                leftTarget,
                left,
                right,
                i,
                j,
                Aleft,
                Aright,
                Bleft,
                Bright,
                valid,
                goLeft,
                odd,
                median
            });

            if (valid) break;
            if (goLeft) right = i - 1;
            else left = i + 1;
        }

        return steps;
    }

    function getCodeInfo(step) {
        switch (step.phase) {
            case "swap":
                return { lines: [5, 6, 7, 8], text: "鍏堜繚璇?nums1 鏄緝鐭暟缁勶紝杩欐牱鍚庨潰鐨勪簩鍒嗗彧鍦ㄧ煭鏁扮粍涓婅繘琛屻€? };
            case "moveLeft":
                return { lines: [15, 17, 18, 20, 21, 22, 23, 35, 36, 37, 38], text: "杩欎竴姝ヨ鏄?i 澶ぇ浜嗭紝鍥犱负 nums1Left > nums2Right锛屾墍浠ユ妸 right 鏀跺埌 i - 1銆? };
            case "moveRight":
                return { lines: [15, 17, 18, 20, 21, 22, 23, 39, 40, 41], text: "杩欎竴姝ヨ鏄?i 澶皬浜嗭紝鍥犱负 nums2Left > nums1Right锛屾墍浠ユ妸 left 鎺ㄥ埌 i + 1銆? };
            case "foundOdd":
                return { lines: [15, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 29], text: "宸茬粡鎵惧埌鍚堟硶鍒囧垎锛岃€屼笖鎬婚暱搴︽槸濂囨暟锛屾墍浠ヨ繑鍥炲乏鍗婇儴鍒嗘渶澶у€笺€? };
            case "foundEven":
                return { lines: [15, 17, 18, 20, 21, 22, 23, 25, 31, 32, 33], text: "宸茬粡鎵惧埌鍚堟硶鍒囧垎锛岃€屼笖鎬婚暱搴︽槸鍋舵暟锛屾墍浠ュ彇宸﹀崐閮ㄥ垎鏈€澶у€煎拰鍙冲崐閮ㄥ垎鏈€灏忓€肩殑骞冲潎銆? };
            default:
                return { lines: [], text: "绛夊緟寮€濮嬨€? };
        }
    }

    function describeStep(step, index, total) {
        if (step.phase === "swap") {
            return {
                title: `绗?${index + 1} 姝?/ ${total} 姝,
                desc: "杈撳叆鏃跺厛鍋氶澶勭悊锛氭妸杈冪煭鏁扮粍鏀惧埌涓婇潰锛屽悗闈㈠氨鍦ㄥ畠韬笂鍋氫簩鍒嗐€?
            };
        }

        let desc = `灏濊瘯鎶婄煭鏁扮粍鍒囧湪 i=${step.i}锛岄暱鏁扮粍鍒囧湪 j=${step.j}銆俙;
        if (step.valid) {
            desc += " 涓や釜璺ㄦ暟缁勮竟鐣岄兘婊¤冻鏉′欢锛岃鏄庡垏鍒嗘纭€?;
        } else if (step.goLeft) {
            desc += ` 鍥犱负 Aleft=${formatBoundaryValue(step.Aleft)} > Bright=${formatBoundaryValue(step.Bright)}锛岃鏄?i 鍋忓ぇ锛岃寰€宸︽敹銆俙;
        } else {
            desc += ` 鍥犱负 Bleft=${formatBoundaryValue(step.Bleft)} > Aright=${formatBoundaryValue(step.Aright)}锛岃鏄?i 鍋忓皬锛岃寰€鍙崇Щ銆俙;
        }

        return {
            title: `绗?${index + 1} 姝?/ ${total} 姝,
            desc
        };
    }

    function getBeginnerText(step) {
        if (step.phase === "swap") {
            return "鍏堟妸鐭暟缁勬斁鍒颁笂闈€傚洜涓烘瘡娆″彧鍦ㄤ竴涓暟缁勪笂璇曞垏鐐癸紝閫夌煭鐨勯偅涓洿鐪佷簨锛屼篃鏇翠笉瀹规槗鎶婅竟鐣屾悶涔便€?;
        }

        if (step.valid) {
            if (step.odd) {
                return `鐜板湪鍒囧浜嗭紝鑰屼笖鎬婚暱搴︽槸濂囨暟锛屾墍浠ヤ腑浣嶆暟灏辨槸宸﹀崐杈规渶澶х殑閭ｄ釜鏁帮紝涔熷氨鏄?${Math.max(step.Aleft, step.Bleft)}銆俙;
            }
            return `鐜板湪鍒囧浜嗭紝鑰屼笖鎬婚暱搴︽槸鍋舵暟锛屾墍浠ヨ鐪嬧€滃乏杈规渶澶р€濆拰鈥滃彸杈规渶灏忊€濄€傝繖涓や釜鏁板垎鍒槸 ${Math.max(step.Aleft, step.Bleft)} 鍜?${Math.min(step.Aright, step.Bright)}銆俙;
        }

        if (step.goLeft) {
            return `杩欏垁鍒囧緱澶潬鍙充簡銆傚洜涓虹煭鏁扮粍宸﹁竟鏈€鍚庝竴涓暟 ${formatBoundaryValue(step.Aleft)} 姣旈暱鏁扮粍鍙宠竟绗竴涓暟 ${formatBoundaryValue(step.Bright)} 杩樺ぇ锛岃鏄庡乏杈规嬁澶氫簡銆俙;
        }

        return `杩欏垁鍒囧緱澶潬宸︿簡銆傚洜涓洪暱鏁扮粍宸﹁竟鏈€鍚庝竴涓暟 ${formatBoundaryValue(step.Bleft)} 姣旂煭鏁扮粍鍙宠竟绗竴涓暟 ${formatBoundaryValue(step.Aright)} 杩樺ぇ锛岃鏄庡乏杈规嬁灏戜簡銆俙;
    }

    function getFormulaText(step) {
        if (step.phase === "swap") {
            return "鍏堟弧瓒?m <= n锛屽悗缁彧鍦ㄧ煭鏁扮粍涓婁簩鍒嗐€?;
        }

        return `宸﹁竟鍏冪礌鎬绘暟鍥哄畾涓?(m + n + 1) / 2 = ${step.leftTarget}銆傚綋鍓嶈竟鐣屽€兼槸 Aleft=${formatBoundaryValue(step.Aleft)}銆丄right=${formatBoundaryValue(step.Aright)}銆丅left=${formatBoundaryValue(step.Bleft)}銆丅right=${formatBoundaryValue(step.Bright)}銆俙;
    }

    function renderCode(activeLines, explanation) {
        codeBlock.innerHTML = "";
        const activeSet = new Set(activeLines);

        codeLines.forEach((line, idx) => {
            const row = document.createElement("div");
            row.className = "code-line";
            if (activeSet.size > 0) {
                row.classList.add(activeSet.has(idx + 1) ? "active" : "dimmed");
            }

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
        cutSub.textContent = "鍏堢偣鍑烩€滅敓鎴愭楠も€?;
        leftCountValue.textContent = "-";
        targetLeftCount.textContent = "-";
        compareValue.textContent = "-";
        compareSub.textContent = "绛夊緟姝ラ";
        medianValue.textContent = "-";
        medianSub.textContent = "鍒囧垎鎴愬姛鍚庡嚭鐜?;
        formulaBox.innerHTML = "宸﹁竟鍏冪礌鎬绘暟鍥哄畾涓?<strong>(m + n + 1) / 2</strong>銆?br>褰撴弧瓒?<strong>Aleft &lt;= Bright</strong> 涓?<strong>Bleft &lt;= Aright</strong> 鏃讹紝璇存槑鍒囧垎姝ｇ‘銆?;
        stepExplain.textContent = "鍏堢敓鎴愭楠わ紝鐒跺悗鐪嬫瘡涓€姝ユ槸濡備綍鍐冲畾鍒囩偣搴旇寰€宸﹁繕鏄線鍙炽€?;
        beginnerExplain.textContent = "鎴戜細鐢ㄦ洿鍙ｈ鐨勮瘽瑙ｉ噴褰撳墠杩欎竴姝ャ€備綘鍙互鍒囨崲鍒板叕寮忔ā寮忥紝鐪嬫洿绱у噾鐨勮〃杈俱€?;
        resultBig.textContent = "-";
        resultExplain.textContent = "褰撴€婚暱搴︿负濂囨暟锛岀瓟妗堟槸宸﹀崐閮ㄥ垎鏈€澶у€硷紱褰撴€婚暱搴︿负鍋舵暟锛岀瓟妗堟槸宸﹀崐閮ㄥ垎鏈€澶у€煎拰鍙冲崐閮ㄥ垎鏈€灏忓€肩殑骞冲潎銆?;
        renderCode([], "杩欓噷浼氳鏄庡綋鍓嶉珮浜唬鐮佷负浠€涔堣鎵ц銆?);
    }

    function renderCurrentStep() {
        if (!state.steps.length) return;

        const step = state.steps[state.index];
        renderStepList();

        if (step.phase === "swap") {
            renderArray(arrayA, step.a, 0, -1, 0);
            renderArray(arrayB, step.b, 0, -1, 0);
            cutValue.textContent = "棰勫鐞?;
            cutSub.textContent = "鍏堜繚璇佷笂闈㈢殑鏁扮粍鏇寸煭";
            leftCountValue.textContent = "-";
            targetLeftCount.textContent = String(step.leftTarget);
            compareValue.textContent = "-";
            compareSub.textContent = "涓嬩竴姝ユ墠寮€濮嬬湡姝ｈ瘯鍒囩偣";
            medianValue.textContent = "-";
            medianSub.textContent = "鍒囧垎鎴愬姛鍚庡嚭鐜?;
            resultBig.textContent = "-";
            resultExplain.textContent = "杩欓噷鍙槸棰勫鐞嗭紝杩樻病鏈夊紑濮嬫壘涓綅鏁般€?;
        } else {
            renderArray(arrayA, step.a, step.i, step.i - 1, step.i);
            renderArray(arrayB, step.b, step.j, step.j - 1, step.j);
            cutValue.textContent = `i = ${step.i}, j = ${step.j}`;
            cutSub.textContent = step.swapped ? "宸茶嚜鍔ㄤ氦鎹㈣緭鍏ワ紝褰撳墠涓婃柟鏄緝鐭暟缁? : "褰撳墠涓婃柟鏈潵灏辨槸杈冪煭鏁扮粍";
            leftCountValue.textContent = `${step.i + step.j}`;
            targetLeftCount.textContent = String(step.leftTarget);
            compareValue.textContent = `${formatBoundaryValue(step.Aleft)} <= ${formatBoundaryValue(step.Bright)} / ${formatBoundaryValue(step.Bleft)} <= ${formatBoundaryValue(step.Aright)}`;

            if (step.valid) {
                compareSub.textContent = "涓ょ粍姣旇緝閮芥垚绔嬶紝鍒囧垎姝ｇ‘銆?;
                medianValue.textContent = String(step.median);
                medianSub.textContent = step.odd ? "鎬婚暱搴︿负濂囨暟锛屽彇宸﹀崐閮ㄥ垎鏈€澶у€笺€? : "鎬婚暱搴︿负鍋舵暟锛屽彇宸﹀崐閮ㄥ垎鏈€澶у€间笌鍙冲崐閮ㄥ垎鏈€灏忓€肩殑骞冲潎銆?;
                resultBig.textContent = String(step.median);
                resultExplain.textContent = medianSub.textContent;
            } else if (step.goLeft) {
                compareSub.textContent = "Aleft 澶ぇ锛岃鏄?i 鍒囧緱澶潬鍙炽€?;
                medianValue.textContent = "-";
                medianSub.textContent = "杩樻病鎵惧埌鍚堟硶鍒囧垎銆?;
                resultBig.textContent = "-";
                resultExplain.textContent = "鍥犱负鐭暟缁勫乏杈规嬁澶浜嗭紝鎵€浠ュ垏鐐硅寰€宸︽敹缂┿€?;
            } else {
                compareSub.textContent = "Bleft 澶ぇ锛岃鏄?i 鍒囧緱澶潬宸︺€?;
                medianValue.textContent = "-";
                medianSub.textContent = "杩樻病鎵惧埌鍚堟硶鍒囧垎銆?;
                resultBig.textContent = "-";
                resultExplain.textContent = "鍥犱负鐭暟缁勫乏杈规嬁澶皯浜嗭紝鎵€浠ュ垏鐐硅寰€鍙崇Щ鍔ㄣ€?;
            }
        }

        formulaBox.innerHTML = state.mode === "simple"
            ? `褰撳墠杩樻槸鏄剧ず鏍稿績鍏紡锛?strong>${getFormulaText(step)}</strong>`
            : getFormulaText(step);
        stepExplain.textContent = describeStep(step, state.index, state.steps.length).desc;
        beginnerExplain.textContent = getBeginnerText(step);

        const codeInfo = getCodeInfo(step);
        renderCode(codeInfo.lines, codeInfo.text);
    }

    function stopPlay() {
        if (state.timer !== null) {
            clearInterval(state.timer);
            state.timer = null;
            playBtn.textContent = "鑷姩鎾斁";
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
        if (!state.steps.length) {
            build();
            if (!state.steps.length) return;
        }
        if (state.index < state.steps.length - 1) {
            state.index += 1;
            renderCurrentStep();
        } else {
            stopPlay();
        }
    }

    function resetStep() {
        stopPlay();
        if (!state.steps.length) {
            build();
            return;
        }
        state.index = 0;
        renderCurrentStep();
    }

    function togglePlay() {
        if (!state.steps.length) {
            build();
            if (!state.steps.length) return;
        }
        if (state.timer !== null) {
            stopPlay();
            return;
        }
        playBtn.textContent = "鏆傚仠";
        state.timer = setInterval(() => {
            if (state.index >= state.steps.length - 1) {
                stopPlay();
                return;
            }
            nextStep();
        }, Number(speedRange.value));
    }

    function setMode(mode) {
        state.mode = mode;
        simpleModeBtn.classList.toggle("active", mode === "simple");
        proModeBtn.classList.toggle("active", mode === "pro");
        modeHint.textContent = mode === "simple"
            ? "褰撳墠浼氫紭鍏堢敤鍙ｈ瑙ｉ噴姣忎竴姝ュ湪骞蹭粈涔堛€?
            : "褰撳墠浼氫紭鍏堢敤鏇寸揣鍑戠殑鍏紡鍜屾潯浠舵潵瑙ｉ噴銆?;
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
        if (state.timer !== null) {
            stopPlay();
            togglePlay();
        }
    });

    resetVisual();
    build();

