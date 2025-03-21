/**
 * 관리자 모드 이스터에그 및 UI 구현 - 실시간 설정 변경 지원
 */
document.addEventListener('DOMContentLoaded', function() {
    // 헤더 영역을 선택
    const headerElement = document.querySelector('.header-custom');

    if (headerElement) {
        let clickCount = 0;
        let lastClickTime = 0;

        // 헤더 클릭 이벤트 추가
        headerElement.addEventListener('click', function(e) {
            const currentTime = new Date().getTime();

            // 클릭 간격이 3초 이내인 경우에만 카운트 증가
            if (currentTime - lastClickTime < 3000) {
                clickCount++;
            } else {
                clickCount = 1; // 간격이 너무 길면 처음부터 다시 시작
            }

            lastClickTime = currentTime;

            // 디버깅 목적으로 콘솔에 클릭 수 출력
            console.log(`헤더 클릭: ${clickCount}번`);

            // 10번 연속 클릭하면 관리자 모드 활성화
            if (clickCount >= 10) {
                activateAdminMode();
                clickCount = 0; // 클릭 카운트 초기화
            }
        });
    }

    // 서버에서 현재 가챠 설정 가져오기
    async function fetchGachaSettings() {
        try {
            const response = await fetch('/api/settings/gacha');
            if (!response.ok) {
                throw new Error('서버에서 설정을 가져오는데 실패했습니다');
            }
            return await response.json();
        } catch (error) {
            console.error('가챠 설정 가져오기 실패:', error);
            // 오류 발생 시 기본값 반환
            return {
                luckyChance: 0.1,
                defaultHighRankCount: 1,
                specialHighRankCount: 2,
                specialMonsters: ['TRUE_DAHARD', 'ALSUVERDE', 'GORE_MAGALA', 'RADAU', 'WOODTUNA'],
                lastUpdated: Date.now()
            };
        }
    }

    // 가챠 설정 업데이트
    async function updateGachaSettings(settings) {
        try {
            const response = await fetch('/api/settings/gacha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                throw new Error('설정 업데이트에 실패했습니다');
            }

            return await response.json();
        } catch (error) {
            console.error('설정 업데이트 실패:', error);
            throw error;
        }
    }

    // 가챠 설정 초기화
    async function resetGachaSettings() {
        try {
            const response = await fetch('/api/settings/gacha/reset', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('설정 초기화에 실패했습니다');
            }

            return await response.json();
        } catch (error) {
            console.error('설정 초기화 실패:', error);
            throw error;
        }
    }

    // 마지막 업데이트 시간 표시
    function updateLastUpdateTime(timestamp) {
        const lastUpdateTime = document.getElementById('lastUpdateTime');
        if (lastUpdateTime) {
            const date = new Date(timestamp);
            lastUpdateTime.textContent = date.toLocaleString();
        }
    }

    // 관리자 모드 활성화 함수
    async function activateAdminMode() {
        console.log('관리자 모드 활성화!');

        try {
            // 현재 설정 가져오기
            const currentSettings = await fetchGachaSettings();
            console.log('현재 가챠 설정:', currentSettings);

            // 이미 관리자 패널이 있는지 확인
            const existingPanel = document.getElementById('adminPanel');
            const existingOverlay = document.getElementById('adminOverlay');

            if (existingPanel) {
                existingPanel.style.display = 'block';
                existingOverlay.style.display = 'block';

                // 이미 존재하는 패널의 설정 값 업데이트
                document.getElementById('luckyChanceSlider').value = currentSettings.luckyChance * 100;
                document.getElementById('luckyChanceValue').textContent = `${(currentSettings.luckyChance * 100).toFixed(1)}%`;
                document.getElementById('defaultHighRankInput').value = currentSettings.defaultHighRankCount;
                document.getElementById('specialHighRankInput').value = currentSettings.specialHighRankCount;
                document.getElementById('specialMonstersInput').value = currentSettings.specialMonsters.join(', ');

                // 마지막 업데이트 시간 표시
                updateLastUpdateTime(currentSettings.lastUpdated);

                return;
            }

            // 오버레이 생성
            const overlay = document.createElement('div');
            overlay.id = 'adminOverlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9998';
            document.body.appendChild(overlay);

            // 관리자 패널 생성
            const adminPanel = document.createElement('div');
            adminPanel.id = 'adminPanel';
            adminPanel.style.position = 'fixed';
            adminPanel.style.top = '50%';
            adminPanel.style.left = '50%';
            adminPanel.style.transform = 'translate(-50%, -50%)';
            adminPanel.style.maxHeight = '80vh'; // 화면 높이의 80%로 제한
            adminPanel.style.overflowY = 'auto';  // 스크롤 가능하도록
            adminPanel.style.backgroundColor = 'white';
            adminPanel.style.borderRadius = '8px';
            adminPanel.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            adminPanel.style.zIndex = '9999';
            adminPanel.style.width = '500px';
            adminPanel.style.maxWidth = '90%';

            // 관리자 패널 내용
            adminPanel.innerHTML = `
                <div style="position: sticky; top: 0; background-color: #dc3545; color: white; padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0;"><i class="fa-solid fa-lock" style="margin-right: 10px;"></i>관리자 모드</h4>
                    <button id="closeAdminBtn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                        <i class="fa-solid fa-triangle-exclamation" style="margin-right: 5px;"></i>
                        주의: 관리자 기능은 신중하게 사용하세요! 모든 변경사항은 <strong>모든 사용자</strong>에게 실시간으로 적용됩니다.
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h5 style="border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">가챠 확률 설정</h5>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">럭키 확률 조정 (%)</label>
                            <input type="range" id="luckyChanceSlider" min="1" max="100" step="1" value="${currentSettings.luckyChance * 100}" style="width: 100%;">
                            <div style="display: flex; justify-content: space-between;">
                                <small>1%</small>
                                <small id="luckyChanceValue">${(currentSettings.luckyChance * 100).toFixed(1)}%</small>
                                <small>100%</small>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">확정 상위 방어구 개수 (일반 몬스터)</label>
                            <input type="number" id="defaultHighRankInput" min="0" max="5" value="${currentSettings.defaultHighRankCount}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">확정 상위 방어구 개수 (특별 몬스터)</label>
                            <input type="number" id="specialHighRankInput" min="0" max="5" value="${currentSettings.specialHighRankCount}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                        </div>
                        
                        <button id="saveSettingsBtn" style="background-color: #198754; color: white; border: none; padding: 10px; border-radius: 4px; width: 100%; cursor: pointer; margin-top: 10px;">
                            <i class="fa-solid fa-floppy-disk" style="margin-right: 5px;"></i>설정 저장
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h5 style="border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">테스트 기능</h5>
                        <div>
                            <button id="testLuckyBtn" style="background-color: #ffc107; color: black; border: none; padding: 10px; border-radius: 4px; width: 100%; cursor: pointer; margin-bottom: 10px;">
                                <i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 5px;"></i>럭키 모드 테스트
                            </button>
                            <button id="resetDataBtn" style="background-color: white; color: #dc3545; border: 1px solid #dc3545; padding: 10px; border-radius: 4px; width: 100%; cursor: pointer;">
                                <i class="fa-solid fa-trash-can" style="margin-right: 5px;"></i>모든 설정 초기화
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h5 style="border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">특별 몬스터 관리</h5>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">특별 몬스터 목록 (상위 방어구 추가 확정)</label>
                            <textarea id="specialMonstersInput" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">${currentSettings.specialMonsters.join(', ')}</textarea>
                            <small style="color: #6c757d; display: block; margin-top: 5px;">몬스터 코드를 쉼표로 구분하여 입력하세요. (예: TRUE_DAHARD, ALSUVERDE)</small>
                        </div>
                    </div>
                </div>
                <div style="background-color: #f8f9fa; padding: 10px 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; color: #6c757d; font-size: 12px;">
                    마지막 설정 업데이트: <span id="lastUpdateTime">${new Date(currentSettings.lastUpdated).toLocaleString()}</span>
                </div>
            `;

            // 관리자 패널을 body에 추가
            document.body.appendChild(adminPanel);

            // 슬라이더 이벤트 등록
            const luckyChanceSlider = document.getElementById('luckyChanceSlider');
            const luckyChanceValue = document.getElementById('luckyChanceValue');

            luckyChanceSlider.addEventListener('input', function() {
                luckyChanceValue.textContent = `${parseFloat(this.value).toFixed(1)}%`;
            });

            // 닫기 버튼 이벤트 등록
            document.getElementById('closeAdminBtn').addEventListener('click', function() {
                adminPanel.style.display = 'none';
                overlay.style.display = 'none';
            });

            // 오버레이 클릭 시 패널 닫기
            overlay.addEventListener('click', function() {
                adminPanel.style.display = 'none';
                this.style.display = 'none';
            });

            // ESC 키로 패널 닫기
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && adminPanel.style.display !== 'none') {
                    adminPanel.style.display = 'none';
                    overlay.style.display = 'none';
                }
            });

            // 설정 저장 버튼 이벤트 등록
            document.getElementById('saveSettingsBtn').addEventListener('click', async function() {
                // 버튼 비활성화 및 로딩 표시
                this.disabled = true;
                this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...';

                try {
                    // 설정 데이터 수집
                    const luckyChance = parseFloat(luckyChanceSlider.value) / 100;
                    const defaultHighRankCount = parseInt(document.getElementById('defaultHighRankInput').value);
                    const specialHighRankCount = parseInt(document.getElementById('specialHighRankInput').value);
                    const specialMonstersText = document.getElementById('specialMonstersInput').value;

                    // 특별 몬스터 목록 처리
                    const specialMonsters = specialMonstersText.split(',')
                        .map(item => item.trim())
                        .filter(item => item.length > 0);

                    // 저장할 설정 데이터
                    const settings = {
                        luckyChance,
                        defaultHighRankCount,
                        specialHighRankCount,
                        specialMonsters,
                        lastUpdated: Date.now()
                    };

                    // 서버에 설정 저장
                    const result = await updateGachaSettings(settings);

                    if (result.success) {
                        // 성공 알림
                        alert('설정이 성공적으로 저장되었습니다! 모든 사용자에게 즉시 적용됩니다.');

                        // 마지막 업데이트 시간 표시
                        updateLastUpdateTime(result.timestamp);
                    } else {
                        throw new Error(result.message || '알 수 없는 오류가 발생했습니다.');
                    }
                } catch (error) {
                    console.error('설정 저장 오류:', error);
                    alert('설정 저장에 실패했습니다: ' + error.message);
                } finally {
                    // 버튼 상태 복원
                    this.disabled = false;
                    this.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right: 5px;"></i>설정 저장';
                }
            });

            // 테스트 버튼 이벤트 등록
            document.getElementById('testLuckyBtn').addEventListener('click', function() {
                alert('🎉 럭키 모드 테스트 활성화! 🎉');

                // 기존 테스트 함수 호출
                if (typeof window.testLuckyMode === 'function') {
                    window.testLuckyMode();
                }

                // 패널 닫기
                adminPanel.style.display = 'none';
                overlay.style.display = 'none';
            });

            // 설정 초기화 버튼 이벤트 등록
            document.getElementById('resetDataBtn').addEventListener('click', async function() {
                if (confirm('정말로 모든 설정을 기본값으로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    // 버튼 비활성화 및 로딩 표시
                    this.disabled = true;
                    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 초기화 중...';

                    try {
                        // 서버에 초기화 요청
                        const result = await resetGachaSettings();

                        if (result.success) {
                            alert('모든 설정이 기본값으로 초기화되었습니다.');

                            // 페이지 새로고침 (0.5초 후)
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        } else {
                            throw new Error(result.message || '알 수 없는 오류가 발생했습니다.');
                        }
                    } catch (error) {
                        console.error('설정 초기화 오류:', error);
                        alert('설정 초기화에 실패했습니다: ' + error.message);

                        // 버튼 상태 복원
                        this.disabled = false;
                        this.innerHTML = '<i class="fa-solid fa-trash-can" style="margin-right: 5px;"></i>모든 설정 초기화';
                    }
                }
            });
        } catch (error) {
            console.error('관리자 모드 활성화 중 오류 발생:', error);
            alert('관리자 모드를 로드하는 중 오류가 발생했습니다: ' + error.message);
        }
    }
});