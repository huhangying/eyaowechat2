import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Survey } from '../models/survey/survey.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SurveyGroup } from '../models/survey/survey-group.model';
import { CoreService } from '../core/services/core.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(
    private api: ApiService,
    private core: CoreService,
  ) { }

  getMySurveyGroups(userid: string): Observable<SurveyGroup[]> {
    return this.api.get<Survey[]>(`mysurveys/${userid}`).pipe(
      map(surveys => {
        if (!surveys?.length) return [];
        // groupkey by doctor+type+createdAt(minute)
        const groupKeys: string[] = [];
        return surveys.reduce((newSurveyGroups, survey) => {
          const groupkey = survey.doctor?._id + survey.type + this.core.getMinutes(survey.createdAt);
          if (groupKeys.length < 1 || groupKeys.indexOf(groupkey) === -1) {
            groupKeys.push(groupkey);
            newSurveyGroups.push({
              groupkey: groupkey,
              type: survey.type,
              surveys: [survey]
            });
            return newSurveyGroups;
          }
          newSurveyGroups = newSurveyGroups.map(group => {
            if (group.groupkey === groupkey) {
              group.surveys.push(survey);
            }
            return group;
          })
          return newSurveyGroups;
        }, [])
      })
    );
  }

  saveSurvey(survey: Survey) {
    return this.api.patch<Survey>('survey/' + survey._id, survey);
  }

  getSurveyGroupNameByType(type: number) {
    switch (type) {
      case 1:
        return '初诊问卷';
      case 2:
        return '复诊问卷';
      case 3:
        return '随访问卷';
      case 4:
        return '药物知识自测';
      case 5:
        return '门诊结论';
      case 6:
        return '药师评估';
      default:
        return '';
    }
  }

}
