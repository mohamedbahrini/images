import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymizerComponent } from './anonymizer.component';

describe('AnonymizerComponent', () => {
  let component: AnonymizerComponent;
  let fixture: ComponentFixture<AnonymizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
